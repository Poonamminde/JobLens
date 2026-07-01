export type ResumeTemplate = 'minimalist' | 'professional-split' | 'modern-accent' | 'timeline';

export interface PersonalDetails {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

export interface ProjectItem {
  name: string;
  techStack: string;
  link: string;
  description: string;
}

export interface ResumeFormData {
  personalDetails: PersonalDetails;
  professionalSummary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  selectedTemplate: ResumeTemplate;
}
