import type { EducationItem, ExperienceItem, ProjectItem, ResumeFormData, ResumeTemplate } from '../../types/resume';

// ─── Template metadata ────────────────────────────────────────────────────────

export interface TemplateOption {
  value: ResumeTemplate;
  label: string;
  description: string;
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { value: 'minimalist',         label: 'Minimalist',         description: 'Clean and distraction-free' },
  { value: 'professional-split', label: 'Professional Split', description: 'Strong two-column structure' },
  { value: 'modern-accent',      label: 'Modern Accent',      description: 'Bold visual layout' },
  { value: 'timeline',           label: 'Timeline',           description: 'Story-driven and polished' },
];

export const VALID_TEMPLATES = new Set<ResumeTemplate>(
  TEMPLATE_OPTIONS.map((t) => t.value),
);

// ─── Empty item factories ─────────────────────────────────────────────────────

export const emptyExperience = (): ExperienceItem => ({
  company: '', role: '', startDate: '', endDate: '', description: '',
});

export const emptyEducation = (): EducationItem => ({
  institution: '', degree: '', year: '',
});

export const emptyProject = (): ProjectItem => ({
  name: '', techStack: '', link: '', description: '',
});

// ─── Default form state ───────────────────────────────────────────────────────

export const DEFAULT_RESUME: ResumeFormData = {
  personalDetails: {
    fullName: '', email: '', phone: '',
    linkedin: '', github: '', portfolio: '',
  },
  professionalSummary: '',
  skills: [],
  experience: [emptyExperience()],
  education:  [emptyEducation()],
  projects:   [emptyProject()],
  selectedTemplate: 'minimalist',
};
