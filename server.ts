import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Route: Enhance Bullet Points
app.post("/api/ai/enhance-bullet", async (req, res) => {
  try {
    const { bulletText, sectionType, context } = req.body;
    if (!bulletText || typeof bulletText !== "string") {
      return res.status(400).json({ error: "bulletText string is required." });
    }

    const ai = getGeminiClient();
    const prompt = `You are a professional academic and technical resume reviewer for top engineering colleges and tech firms.
Enhance and rewrite the following resume bullet point to make it highly impactful, action-oriented, quantified, and professionally articulated.

Section Context: ${sectionType || "General"}
Context / Stack: ${context || "N/A"}
Original Bullet: "${bulletText}"

Provide 3 distinct enhanced bullet variations:
1. Concise & Direct (Metric/Action focused)
2. Technical & Detailed (Focus on implementation & tools)
3. Leadership & Result Oriented

Format the response strictly as a JSON array of strings, with no markdown code blocks or extra text:
["variation 1", "variation 2", "variation 3"]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const rawText = response.text || "[]";
    let suggestions: string[] = [];
    try {
      suggestions = JSON.parse(rawText);
    } catch {
      suggestions = [rawText];
    }

    return res.json({ suggestions });
  } catch (error: any) {
    console.error("Gemini enhance-bullet error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate AI enhancements." });
  }
});

// API Route: Suggest Skills for Department / Role
app.post("/api/ai/suggest-skills", async (req, res) => {
  try {
    const { department, role } = req.body;
    const ai = getGeminiClient();

    const prompt = `Act as an academic resume advisor for engineering students.
Provide key technical skills categorizations for a candidate in "${department || "Electronics & Telecommunication"}" targeting roles like "${role || "Embedded Systems & Software Engineer"}".

Return a JSON object with keys: "languages", "web", "tools", "hardware", "coursework", "databases".
Value for each key should be a comma-separated string of top 5-8 industry-relevant skills.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const skills = JSON.parse(response.text || "{}");
    return res.json({ skills });
  } catch (error: any) {
    console.error("Gemini suggest-skills error:", error);
    return res.status(500).json({ error: error.message || "Failed to suggest skills." });
  }
});

// API Route: Tailor Resume to Job Description
app.post("/api/ai/tailor-resume", async (req, res) => {
  try {
    const { jobDescription, resumeSummary } = req.body;
    const ai = getGeminiClient();

    const prompt = `Analyze this target Job Description alongside the candidate's current resume summary:

Job Description:
${jobDescription}

Candidate Resume Summary:
${JSON.stringify(resumeSummary)}

Provide actionable recommendations in JSON format:
{
  "matchScore": 85,
  "missingKeywords": ["Docker", "Kubernetes", "System Design"],
  "recommendedActionItems": [
    "Highlight your ESP32 FreeRTOS project at the top of Page 1",
    "Add C++ unit testing framework to Skills"
  ],
  "tailoredSummary": "A tailored professional summary..."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const analysis = JSON.parse(response.text || "{}");
    return res.json({ analysis });
  } catch (error: any) {
    console.error("Gemini tailor-resume error:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze job description." });
  }
});

async function startServer() {
  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
