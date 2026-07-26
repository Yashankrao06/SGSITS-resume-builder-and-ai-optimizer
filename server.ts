import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import * as pdfParseModule from "pdf-parse";
const pdfParse = (pdfParseModule as any).default || pdfParseModule;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Helper function to parse PDF raw text directly without API keys
async function parsePdfTextLocally(pdfBuffer: Buffer) {
  const parsed = await pdfParse(pdfBuffer);
  const rawText = parsed.text || "";

  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Email regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "";

  // Phone regex
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/);
  const mobile = phoneMatch ? phoneMatch[0] : "";

  // Name extraction from initial lines
  let name = "";
  for (const line of lines.slice(0, 10)) {
    if (
      !line.includes("@") &&
      !line.match(/\d{5}/) &&
      !/resume|curriculum|sgsits|cv|page/i.test(line) &&
      line.length >= 2 &&
      line.length <= 40
    ) {
      name = line;
      break;
    }
  }

  // Enrollment No / Roll No regex
  const rollMatch = rawText.match(/(?:Enrollment|Roll)\s*(?:No\.?|Num\.?|#)?\s*[:\-]?\s*([A-Za-z0-9\/]+)/i);
  const enrollmentNo = rollMatch ? rollMatch[1] : "";

  // Section splitting
  const sections: Record<string, string[]> = {};
  let currentSection = "HEADER";
  sections[currentSection] = [];

  const SECTION_KEYWORDS: Record<string, RegExp> = {
    EDUCATION: /^(academic[s]?|education|qualification[s]?|scholastic\s+details)/i,
    EXPERIENCE: /^(work\s+experience|experience|employment|internship[s]?)/i,
    PROJECTS: /^(project[s]?|academic\s+project[s]?|technical\s+project[s]?)/i,
    SKILLS: /^(technical\s+skill[s]?|skill[s]?|platform[s]?|programming\s+language[s]?|technologies)/i,
    ACHIEVEMENTS: /^(achievement[s]?|award[s]?|honor[s]?|scholastic\s+achievement[s]?)/i,
    POSITIONS: /^(position[s]?\s+of\s+responsibility|responsibility|leadership)/i,
    COURSES: /^(course[s]?|coursework|core\s+course[s]?|relevant\s+course[s]?)/i,
    EXTRACURRICULAR: /^(extracurricular|extra\s+curricular|co-curricular|activities)/i,
  };

  for (const line of lines) {
    let matchedSection = "";
    const cleanLine = line.replace(/[^a-zA-Z\s]/g, "").trim();
    for (const [secKey, regex] of Object.entries(SECTION_KEYWORDS)) {
      if (regex.test(cleanLine)) {
        matchedSection = secKey;
        break;
      }
    }

    if (matchedSection) {
      currentSection = matchedSection;
      if (!sections[currentSection]) sections[currentSection] = [];
    } else {
      if (!sections[currentSection]) sections[currentSection] = [];
      sections[currentSection].push(line);
    }
  }

  // Build education items
  const eduLines = sections.EDUCATION || [];
  const education: any[] = [];
  let eduCount = 1;
  for (const eline of eduLines) {
    const scoreMatch = eline.match(/(?:cgpa|gpa|percentage|%|marks)[\s:]*([\d.]+(?:\s*\/\s*10)?%?)/i) || eline.match(/([\d.]+(?:\s*%\s*|\s*\/\s*10))/);
    const yearMatch = eline.match(/\b(20\d{2}|19\d{2})\b/);
    if (eline.length > 5 && (yearMatch || scoreMatch || /b\.?tech|m\.?tech|class|10th|12th|bachelor|master|degree|school|college|institute|university/i.test(eline))) {
      education.push({
        id: `edu_${eduCount++}`,
        degree: eline.split(/[,|\-]/)[0]?.trim() || eline,
        university: "Board / University",
        institute: "SGSITS Indore",
        year: yearMatch ? yearMatch[1] : "2025",
        score: scoreMatch ? scoreMatch[1] : "",
      });
    }
  }

  // Build experience items
  const expLines = sections.EXPERIENCE || [];
  const experience: any[] = [];
  let expCount = 1;
  let currExp: any = null;
  for (const xline of expLines) {
    if (!currExp || xline.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i) || xline.includes("|") || xline.includes("-")) {
      if (currExp && currExp.company) experience.push(currExp);
      currExp = {
        id: `exp_${expCount++}`,
        company: xline.split(/[\-||\,]/)[0]?.trim() || "Organization",
        role: xline.split(/[\-||\,]/)[1]?.trim() || "Role",
        duration: xline.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}).*/i)?.[0] || "",
        points: [],
      };
    } else if (currExp) {
      currExp.points.push(xline.replace(/^[•\-\*]\s*/, ""));
    }
  }
  if (currExp && currExp.company) experience.push(currExp);

  // Build project items
  const projLines = sections.PROJECTS || [];
  const projects: any[] = [];
  let projCount = 1;
  let currProj: any = null;
  for (const pline of projLines) {
    if (!currProj || (pline.length < 50 && !pline.startsWith("•") && !pline.startsWith("-"))) {
      if (currProj && currProj.title) projects.push(currProj);
      currProj = {
        id: `proj_${projCount++}`,
        title: pline.replace(/^[•\-\*]\s*/, "").split(/[\-\|]/)[0]?.trim() || "Project",
        date: pline.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}).*/i)?.[0] || "",
        points: [],
        type: "technical",
        techStack: "",
        githubLinks: [],
      };
    } else if (currProj) {
      currProj.points.push(pline.replace(/^[•\-\*]\s*/, ""));
    }
  }
  if (currProj && currProj.title) projects.push(currProj);

  // Build achievements
  const achLines = sections.ACHIEVEMENTS || [];
  const achievements = achLines.map((l) => l.replace(/^[•\-\*]\s*/, "")).filter((l) => l.length > 5);

  // Skill text matchers
  const skillLines = sections.SKILLS || [];
  const allSkillText = skillLines.join(" ") || rawText;

  return {
    header: {
      name: name || "Candidate Name",
      ugYear: "UG Student",
      college: "Shri G. S. Institute of Technology and Science, Indore",
      dob: "",
      email: email || "",
      enrollmentNo: enrollmentNo || "",
      department: "Computer Science & Engineering",
      gender: "",
      specialization: "",
      mobile: mobile || "",
      logoUrl: "https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png",
      showLogo: true,
    },
    education: education.length > 0 ? education : [
      {
        id: "edu_1",
        degree: "B.Tech in Computer Science & Engineering",
        university: "RGPV Bhopal",
        institute: "SGSITS Indore",
        year: "2025",
        score: "8.5 CGPA",
      }
    ],
    achievements: achievements.length > 0 ? achievements : ["Extracted from uploaded resume PDF."],
    experience: experience.length > 0 ? experience : [],
    projects: projects.length > 0 ? projects : [],
    skills: {
      osLabel: "Operating Systems",
      os: "Linux, Windows, macOS",
      programmingLabel: "Programming Languages",
      programming: allSkillText.match(/(C\+\+|Java|Python|JavaScript|TypeScript|C|SQL|Go|Rust|HTML|CSS)/gi)?.join(", ") || "C++, Java, Python, JavaScript",
      webLabel: "Web Technologies",
      web: allSkillText.match(/(React|Node\.js|Express|HTML|CSS|Tailwind|Next\.js|MongoDB|REST API|GraphQL)/gi)?.join(", ") || "React, Node.js, Express, HTML, CSS",
      softwareLabel: "Tools & Platforms",
      software: allSkillText.match(/(Git|GitHub|VS Code|Docker|Postman|Linux|Figma|Jira|Kubernetes)/gi)?.join(", ") || "Git, VS Code, Postman, Docker",
    },
    coreCourses: ["Data Structures & Algorithms", "Operating Systems", "Database Management Systems", "Computer Networks"],
    breadthCourses: ["Software Engineering", "Artificial Intelligence"],
    positions: (sections.POSITIONS || []).map((p, i) => ({
      id: `pos_${i + 1}`,
      title: p.replace(/^[•\-\*]\s*/, ""),
      duration: "",
      points: [],
    })),
    extracurricular: (sections.EXTRACURRICULAR || []).map((e, i) => ({
      id: `extra_${i + 1}`,
      title: e.replace(/^[•\-\*]\s*/, ""),
      duration: "",
      points: [],
    })),
    sectionTitles: {
      education: "Academic Details",
      achievements: "Scholastic Achievements",
      experience: "Work Experience",
      projects: "Projects",
      academicProjects: "Academic Projects",
      technicalProjects: "Technical Projects",
      skills: "Platforms, Languages, Technologies & Tools Worked",
      courses: "Courses Undertaken",
      positions: "Positions of Responsibility",
      extracurricular: "Extracurricular Activities",
    },
  };
}

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

// API Route: Extract & Parse Old Resume PDF into Structured CvData
app.post("/api/ai/parse-pdf-resume", async (req, res) => {
  try {
    const { base64Pdf } = req.body;
    if (!base64Pdf || typeof base64Pdf !== "string") {
      return res.status(400).json({ error: "base64Pdf string is required." });
    }

    const cleanedBase64 = base64Pdf.replace(/^data:application\/pdf;base64,/, "");
    const pdfBuffer = Buffer.from(cleanedBase64, "base64");

    // 1. Try Gemini AI parsing if GEMINI_API_KEY is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGeminiClient();
        const pdfPart = {
          inlineData: {
            mimeType: "application/pdf",
            data: cleanedBase64,
          },
        };

        const promptText = `You are an expert academic and technical resume parser.
Extract all relevant information from this candidate's uploaded resume PDF and format it strictly into the target JSON structure below.

TARGET JSON SCHEMA:
{
  "header": {
    "name": "Full Name",
    "ugYear": "e.g. UG 3rd Year or B.Tech CSE",
    "college": "College / University Name (e.g. SGSITS Indore)",
    "dob": "Date of Birth (YYYY-MM-DD or string)",
    "email": "Email Address",
    "enrollmentNo": "Enrollment / Roll Number or empty string",
    "department": "Department / Branch e.g. Computer Science & Engineering",
    "gender": "Gender or empty string",
    "specialization": "Specialization e.g. Software Engineering or Artificial Intelligence",
    "mobile": "Mobile Number",
    "logoUrl": "https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png",
    "showLogo": true
  },
  "education": [
    {
      "id": "edu_1",
      "degree": "Degree / Certificate (e.g., Graduation, 12th, 10th)",
      "university": "University / Board",
      "institute": "Institute / School Name, City",
      "year": "Passing Year (e.g. 2025)",
      "score": "CGPA / Percentage (e.g. 8.5 or 92%)"
    }
  ],
  "achievements": [
    "Scholastic achievement or reward 1",
    "Achievement 2"
  ],
  "experience": [
    {
      "id": "exp_1",
      "company": "Company / Organization Name",
      "role": "Role / Position Title",
      "duration": "Duration / Date range (e.g., May 2024 - Jul 2024)",
      "points": [
        "Bullet point explaining responsibilities and achievements",
        "Bullet point 2"
      ]
    }
  ],
  "projects": [
    {
      "id": "proj_1",
      "title": "Project Title",
      "date": "Date / Duration (e.g., Jan 2025 - Present)",
      "points": [
        "Project description bullet point 1",
        "Project description bullet point 2"
      ],
      "type": "academic" or "technical",
      "techStack": "Comma separated technologies e.g. React, Node.js, Python",
      "githubLinks": [
        { "label": "GitHub", "url": "https://github.com/username/project" }
      ]
    }
  ],
  "skills": {
    "osLabel": "Operating Systems",
    "os": "Operating Systems worked on e.g., Windows, Linux, macOS",
    "programmingLabel": "Programming Skills",
    "programming": "Languages e.g., C++, Java, Python, SQL, JavaScript",
    "webLabel": "Web Technologies",
    "web": "Frameworks/Web e.g., HTML, CSS, React, Express, Node.js",
    "softwareLabel": "Software & Tools",
    "software": "Tools e.g., Git, VS Code, Postman, Docker"
  },
  "coreCourses": ["Course 1", "Course 2"],
  "breadthCourses": ["Elective 1", "Elective 2"],
  "positions": [
    {
      "id": "pos_1",
      "title": "Position of Responsibility Title",
      "duration": "Duration / Date range",
      "points": ["Responsibility detail bullet point"]
    }
  ],
  "extracurricular": [
    {
      "id": "extra_1",
      "title": "Activity or Club Name",
      "duration": "Duration / Year",
      "points": ["Extracurricular activity detail bullet point"]
    }
  ],
  "sectionTitles": {
    "education": "Academic Details",
    "achievements": "Scholastic Achievements",
    "experience": "Work Experience",
    "projects": "Projects",
    "academicProjects": "Academic Projects",
    "technicalProjects": "Technical Projects",
    "skills": "Platforms, Languages, Technologies & Tools Worked",
    "courses": "Courses Undertaken",
    "positions": "Positions of Responsibility",
    "extracurricular": "Extracurricular Activities"
  }
}

Important Instructions:
1. Extract true content from the PDF accurately.
2. Generate unique id fields for all array items (edu_1, exp_1, proj_1, pos_1, extra_1, etc.).
3. If information for a section is missing from the resume, provide empty arrays [] or sensible defaults so the structure remains complete.
4. Keep logoUrl set to "https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png".
5. Return ONLY the JSON object.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: {
            parts: [pdfPart, { text: promptText }],
          },
          config: {
            responseMimeType: "application/json",
          },
        });

        const parsedData = JSON.parse(response.text || "{}");
        if (parsedData && parsedData.header) {
          return res.json({ success: true, data: parsedData, source: "ai" });
        }
      } catch (geminiError) {
        console.warn("Gemini parsing unavailable or failed, switching to local pdf-parse fallback:", geminiError);
      }
    }

    // 2. Direct API-Key-Free Local PDF Text Extraction
    const localParsedData = await parsePdfTextLocally(pdfBuffer);
    return res.json({ success: true, data: localParsedData, source: "local" });

  } catch (error: any) {
    console.error("PDF parsing error:", error);
    return res.status(500).json({ error: error.message || "Failed to parse PDF resume." });
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
