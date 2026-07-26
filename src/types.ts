export type CvMode = '1page' | '2page';

export interface HeaderData {
  name: string;
  ugYear: string;
  college: string;
  dob: string;
  email: string;
  enrollmentNo: string;
  department: string;
  gender: string;
  specialization: string;
  mobile: string;
  logoUrl?: string;
  showLogo?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  university: string;
  institute: string;
  year: string;
  score: string;
}

export interface EducationHeaders {
  degree: string;
  university: string;
  institute: string;
  year: string;
  score: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  points: string[];
}

export interface GithubLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  date: string;
  points: string[];
  type: 'academic' | 'technical';
  techStack?: string;
  githubLinks?: GithubLink[];
}

export interface SkillsData {
  os: string;
  programming: string;
  web: string;
  software: string;
  osLabel?: string;
  programmingLabel?: string;
  webLabel?: string;
  softwareLabel?: string;
}

export interface SimpleEntryItem {
  id: string;
  title: string;
  duration: string;
  points: string[];
}

export interface SectionTitles {
  education: string;
  achievements: string;
  experience: string;
  projects: string;
  academicProjects: string;
  technicalProjects: string;
  skills: string;
  courses: string;
  positions: string;
  extracurricular: string;
}

export interface CvData {
  header: HeaderData;
  education: EducationItem[];
  educationHeaders: EducationHeaders;
  achievements: string[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillsData;
  coreCourses: string[];
  breadthCourses: string[];
  positions: SimpleEntryItem[];
  extracurricular: SimpleEntryItem[];
  sectionTitles: SectionTitles;
}
