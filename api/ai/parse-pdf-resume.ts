import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import * as pdfParseModule from 'pdf-parse';

const pdfParse = (pdfParseModule as any).default || pdfParseModule;

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64Pdf } = req.body || {};
    if (!base64Pdf || typeof base64Pdf !== 'string') {
      return res.status(400).json({ error: 'base64Pdf string is required.' });
    }

    const cleanedBase64 = base64Pdf.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(cleanedBase64, 'base64');

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
        });

        const pdfPart = {
          inlineData: {
            mimeType: 'application/pdf',
            data: cleanedBase64,
          },
        };

        const promptText = `You are an expert academic and technical resume parser. Extract information into structured JSON with header, education, achievements, experience, projects, skills, coreCourses, breadthCourses, positions, and extracurricular arrays.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: {
            parts: [pdfPart, { text: promptText }],
          },
          config: {
            responseMimeType: 'application/json',
          },
        });

        const parsedData = JSON.parse(response.text || '{}');
        if (parsedData && parsedData.header) {
          return res.status(200).json({ success: true, data: parsedData, source: 'ai' });
        }
      } catch (e) {
        console.warn('Gemini serverless parse error:', e);
      }
    }

    const parsed = await pdfParse(pdfBuffer);
    const rawText = parsed.text || '';

    return res.status(200).json({
      success: true,
      data: {
        rawText,
        header: {
          name: 'Extracted Candidate',
          email: '',
          mobile: '',
        },
      },
      source: 'local',
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to parse PDF.' });
  }
}
