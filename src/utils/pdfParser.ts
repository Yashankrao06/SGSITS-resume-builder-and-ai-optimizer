import * as pdfjsLib from 'pdfjs-dist';
import { CvData } from '../types';
import { defaultEducationHeaders, defaultSectionTitles } from '../data/sampleData';

// Configure worker for pdfjs-dist via CDN matching installed version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;

export async function extractTextFromPdfFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  let fullText = '';
  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Group text items by line height / position
    const pageItems = textContent.items as Array<{ str: string; transform?: number[] }>;
    let pageText = '';
    let lastY: number | null = null;

    for (const item of pageItems) {
      if (typeof item.str !== 'string') continue;
      const currentY = item.transform ? item.transform[5] : null;
      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
        pageText += '\n';
      } else if (pageText.length > 0 && !pageText.endsWith('\n') && !pageText.endsWith(' ')) {
        pageText += ' ';
      }
      pageText += item.str;
      lastY = currentY;
    }

    fullText += pageText + '\n';
  }

  return fullText;
}

export function parseRawTextToCvData(rawText: string): CvData {
  const lines = rawText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // Email regex
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone regex
  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/);
  const mobile = phoneMatch ? phoneMatch[0] : '';

  // Name extraction from initial lines
  let name = '';
  for (const line of lines.slice(0, 10)) {
    if (
      !line.includes('@') &&
      !line.match(/\d{5}/) &&
      !/resume|curriculum|sgsits|cv|page|email|phone|mobile/i.test(line) &&
      line.length >= 2 &&
      line.length <= 40
    ) {
      name = line;
      break;
    }
  }

  // Enrollment No / Roll No regex
  const rollMatch = rawText.match(/(?:Enrollment|Roll)\s*(?:No\.?|Num\.?|#)?\s*[:\-]?\s*([A-Za-z0-9\/]+)/i);
  const enrollmentNo = rollMatch ? rollMatch[1] : '';

  // Section splitting
  const sections: Record<string, string[]> = {};
  let currentSection = 'HEADER';
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
    let matchedSection = '';
    const cleanLine = line.replace(/[^a-zA-Z\s]/g, '').trim();
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
    const scoreMatch =
      eline.match(/(?:cgpa|gpa|percentage|%|marks)[\s:]*([\d.]+(?:\s*\/\s*10)?%?)/i) ||
      eline.match(/([\d.]+(?:\s*%\s*|\s*\/\s*10))/);
    const yearMatch = eline.match(/\b(20\d{2}|19\d{2})\b/);
    if (
      eline.length > 5 &&
      (yearMatch ||
        scoreMatch ||
        /b\.?tech|m\.?tech|class|10th|12th|bachelor|master|degree|school|college|institute|university/i.test(
          eline
        ))
    ) {
      education.push({
        id: `edu_${eduCount++}`,
        degree: eline.split(/[,|\-]/)[0]?.trim() || eline,
        university: 'Board / University',
        institute: 'Institute / School',
        year: yearMatch ? yearMatch[1] : '2025',
        score: scoreMatch ? scoreMatch[1] : '',
      });
    }
  }

  // Build experience items
  const expLines = sections.EXPERIENCE || [];
  const experience: any[] = [];
  let expCount = 1;
  let currExp: any = null;
  for (const xline of expLines) {
    if (
      !currExp ||
      xline.match(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/i) ||
      xline.includes('|') ||
      xline.includes('-')
    ) {
      if (currExp && currExp.company) experience.push(currExp);
      currExp = {
        id: `exp_${expCount++}`,
        company: xline.split(/[\-||\,]/)[0]?.trim() || 'Organization',
        role: xline.split(/[\-||\,]/)[1]?.trim() || 'Role / Position',
        duration: xline.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}).*/i)?.[0] || '',
        points: [],
      };
    } else if (currExp) {
      currExp.points.push(xline.replace(/^[•\-\*]\s*/, ''));
    }
  }
  if (currExp && currExp.company) experience.push(currExp);

  // Build project items
  const projLines = sections.PROJECTS || [];
  const projects: any[] = [];
  let projCount = 1;
  let currProj: any = null;
  for (const pline of projLines) {
    if (!currProj || (pline.length < 50 && !pline.startsWith('•') && !pline.startsWith('-'))) {
      if (currProj && currProj.title) projects.push(currProj);
      currProj = {
        id: `proj_${projCount++}`,
        title: pline.replace(/^[•\-\*]\s*/, '').split(/[\-\|]/)[0]?.trim() || 'Project',
        date: pline.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4}).*/i)?.[0] || '',
        points: [],
        type: 'technical',
        techStack: '',
        githubLinks: [],
      };
    } else if (currProj) {
      currProj.points.push(pline.replace(/^[•\-\*]\s*/, ''));
    }
  }
  if (currProj && currProj.title) projects.push(currProj);

  // Build achievements
  const achLines = sections.ACHIEVEMENTS || [];
  const achievements = achLines.map((l) => l.replace(/^[•\-\*]\s*/, '')).filter((l) => l.length > 5);

  // Skill text matchers
  const skillLines = sections.SKILLS || [];
  const allSkillText = skillLines.join(' ') || rawText;

  const progMatches = allSkillText.match(/(C\+\+|Java|Python|JavaScript|TypeScript|C|SQL|Go|Rust|HTML|CSS|PHP|Swift|Kotlin)/gi);
  const webMatches = allSkillText.match(/(React|Node\.js|Express|HTML|CSS|Tailwind|Next\.js|MongoDB|REST API|GraphQL|Django|Flask|Angular|Vue)/gi);
  const toolMatches = allSkillText.match(/(Git|GitHub|VS Code|Docker|Postman|Linux|Figma|Jira|Kubernetes|AWS|Vercel|CI\/CD)/gi);
  const osMatches = allSkillText.match(/(Windows|Linux|macOS|Ubuntu|Android|iOS)/gi);

  return {
    header: {
      name: name || 'Candidate Name',
      ugYear: 'UG Student',
      college: 'Shri G. S. Institute of Technology and Science, Indore',
      dob: '',
      email: email || '',
      enrollmentNo: enrollmentNo || '',
      department: 'Computer Science & Engineering',
      gender: '',
      specialization: '',
      mobile: mobile || '',
      logoUrl: 'https://www.sgsits.ac.in/assets/be1c60d2202eb5c28d7de018f5546a7b65312d26-B4a0U3sN.png',
      showLogo: true,
    },
    educationHeaders: { ...defaultEducationHeaders },
    sectionTitles: { ...defaultSectionTitles },
    education: education.length > 0 ? education : [
      {
        id: 'edu_1',
        degree: 'B.Tech in Computer Science & Engineering',
        university: 'RGPV Bhopal',
        institute: 'SGSITS Indore',
        year: '2025',
        score: '8.5 CGPA',
      }
    ],
    achievements: achievements.length > 0 ? achievements : ['Extracted from uploaded resume PDF.'],
    experience,
    projects,
    skills: {
      osLabel: 'Operating Systems',
      os: osMatches ? Array.from(new Set(osMatches)).join(', ') : 'Linux, Windows, macOS',
      programmingLabel: 'Programming Languages',
      programming: progMatches ? Array.from(new Set(progMatches)).join(', ') : 'C++, Java, Python, JavaScript',
      webLabel: 'Web Technologies',
      web: webMatches ? Array.from(new Set(webMatches)).join(', ') : 'React, Node.js, Express, HTML, CSS',
      softwareLabel: 'Tools & Software',
      software: toolMatches ? Array.from(new Set(toolMatches)).join(', ') : 'Git, VS Code, Postman, Docker',
    },
    coreCourses: ['Data Structures & Algorithms', 'Operating Systems', 'Database Management Systems', 'Computer Networks'],
    breadthCourses: ['Software Engineering', 'Artificial Intelligence'],
    positions: (sections.POSITIONS || []).map((p, i) => ({
      id: `pos_${i + 1}`,
      title: p.replace(/^[•\-\*]\s*/, ''),
      duration: '',
      points: [],
    })),
    extracurricular: (sections.EXTRACURRICULAR || []).map((e, i) => ({
      id: `extra_${i + 1}`,
      title: e.replace(/^[•\-\*]\s*/, ''),
      duration: '',
      points: [],
    })),
  };
}

export async function parsePdfInBrowser(file: File): Promise<CvData> {
  const rawText = await extractTextFromPdfFile(file);
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('Could not extract readable text from the uploaded PDF.');
  }
  return parseRawTextToCvData(rawText);
}
