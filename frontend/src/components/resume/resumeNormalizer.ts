import type { ResumeFormData, ResumeTemplate } from '../../types/resume';
import {
  DEFAULT_RESUME,
  VALID_TEMPLATES,
  emptyEducation,
  emptyExperience,
  emptyProject,
} from './resumeConstants';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type RawObject = Record<string, unknown>;

const getString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const asObject = (value: unknown): RawObject =>
  (value && typeof value === 'object' && !Array.isArray(value))
    ? (value as RawObject)
    : {};

// ─── Public normalizer ────────────────────────────────────────────────────────

/**
 * Converts a raw API response (unknown shape) into a validated ResumeFormData.
 * Falls back to defaults for any missing or malformed fields.
 * Pure function — no React dependency, fully unit-testable.
 */
export const normalizeResumeData = (
  raw: RawObject | null | undefined,
): ResumeFormData => {
  if (!raw) return DEFAULT_RESUME;

  const personal = asObject(raw.personalDetails);

  const selectedTemplate = VALID_TEMPLATES.has(raw.selectedTemplate as ResumeTemplate)
    ? (raw.selectedTemplate as ResumeTemplate)
    : 'minimalist';

  return {
    personalDetails: {
      fullName:  getString(personal.fullName),
      email:     getString(personal.email),
      phone:     getString(personal.phone),
      linkedin:  getString(personal.linkedin),
      github:    getString(personal.github),
      portfolio: getString(personal.portfolio),
    },
    professionalSummary: getString(raw.professionalSummary),
    skills: Array.isArray(raw.skills)
      ? raw.skills.filter((s): s is string => typeof s === 'string')
      : [],
    experience: Array.isArray(raw.experience) && raw.experience.length
      ? raw.experience.map((item) => {
          const o = asObject(item);
          return {
            company:     getString(o.company),
            role:        getString(o.role),
            startDate:   getString(o.startDate),
            endDate:     getString(o.endDate),
            description: getString(o.description),
          };
        })
      : [emptyExperience()],
    education: Array.isArray(raw.education) && raw.education.length
      ? raw.education.map((item) => {
          const o = asObject(item);
          return {
            institution: getString(o.institution),
            degree:      getString(o.degree),
            year:        getString(o.year),
          };
        })
      : [emptyEducation()],
    projects: Array.isArray(raw.projects) && raw.projects.length
      ? raw.projects.map((item) => {
          const o = asObject(item);
          return {
            name:        getString(o.name),
            techStack:   getString(o.techStack),
            link:        getString(o.link),
            description: getString(o.description),
          };
        })
      : [emptyProject()],
    selectedTemplate,
  };
};
