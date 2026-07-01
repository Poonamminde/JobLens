import { useCallback, useEffect, useState } from 'react';
import { createResume, downloadResumePdf, getResumes } from '../../api/resumeApi';
import type { ResumeFormData, ResumeTemplate } from '../../types/resume';
import {
  DEFAULT_RESUME,
  emptyEducation,
  emptyExperience,
  emptyProject,
} from './resumeConstants';
import { normalizeResumeData } from './resumeNormalizer';

type ArraySection = 'experience' | 'education' | 'projects';

export interface ResumeBuilderApi {
  // State
  formData:    ResumeFormData;
  skillInput:  string;
  isSaving:    boolean;
  isLoading:   boolean;
  status:      string;

  // Personal + summary + template
  updatePersonalDetails: (field: keyof ResumeFormData['personalDetails'], value: string) => void;
  updateSummary:         (value: string) => void;
  setTemplate:           (template: ResumeTemplate) => void;

  // Skills
  setSkillInput: (value: string) => void;
  addSkill:      () => void;
  removeSkill:   (skill: string) => void;

  // Dynamic arrays (experience / education / projects)
  updateArrayItem: (section: ArraySection, index: number, field: string, value: string) => void;
  addArrayItem:    (section: ArraySection) => void;
  removeArrayItem: (section: ArraySection, index: number) => void;

  // Persistence
  handleSave:     () => Promise<void>;
  handleDownload: () => Promise<void>;
}

const EMPTY_FACTORY: Record<ArraySection, () => unknown> = {
  experience: emptyExperience,
  education:  emptyEducation,
  projects:   emptyProject,
};

/**
 * Owns all resume-builder state and side effects.
 * The page component only calls this hook and passes the returned API to child sections.
 */
export function useResumeBuilder(): ResumeBuilderApi {
  const [formData,   setFormData]   = useState<ResumeFormData>(DEFAULT_RESUME);
  const [skillInput, setSkillInput] = useState('');
  const [isSaving,   setIsSaving]   = useState(false);
  const [isLoading,  setIsLoading]  = useState(true);
  const [status,     setStatus]     = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const resumes = await getResumes();
        const latest  = Array.isArray(resumes) && resumes.length > 0 ? resumes[0] : null;
        if (latest) {
          setFormData(normalizeResumeData(latest));
          setStatus('Loaded your saved resume details.');
        } else {
          setStatus('');
        }
      } catch {
        setStatus('Unable to load saved resume details.');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  // ─── Field updaters ───────────────────────────────────────────────────────
  const updatePersonalDetails = useCallback(
    (field: keyof ResumeFormData['personalDetails'], value: string) =>
      setFormData((prev) => ({
        ...prev,
        personalDetails: { ...prev.personalDetails, [field]: value },
      })),
    [],
  );

  const updateSummary = useCallback(
    (value: string) => setFormData((prev) => ({ ...prev, professionalSummary: value })),
    [],
  );

  const setTemplate = useCallback(
    (template: ResumeTemplate) => setFormData((prev) => ({ ...prev, selectedTemplate: template })),
    [],
  );

  // ─── Skills ───────────────────────────────────────────────────────────────
  const addSkill = useCallback(() => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput('');
  }, [skillInput]);

  const removeSkill = useCallback(
    (skill: string) =>
      setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) })),
    [],
  );

  // ─── Array sections ───────────────────────────────────────────────────────
  const updateArrayItem = useCallback(
    (section: ArraySection, index: number, field: string, value: string) =>
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      })),
    [],
  );

  const addArrayItem = useCallback(
    (section: ArraySection) =>
      setFormData((prev) => ({
        ...prev,
        [section]: [...prev[section], EMPTY_FACTORY[section]()],
      })),
    [],
  );

  const removeArrayItem = useCallback(
    (section: ArraySection, index: number) =>
      setFormData((prev) => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index),
      })),
    [],
  );

  // ─── Persistence ─────────────────────────────────────────────────────────
  const persistResume = async (payload: ResumeFormData = formData) => {
    setIsSaving(true);
    setStatus('Saving your resume...');
    const saved = await createResume(payload);
    setFormData(normalizeResumeData(saved));
    return saved;
  };

  const handleSave = async () => {
    try {
      await persistResume();
      setStatus('Resume saved successfully. You can download it as a PDF now.');
    } catch {
      setStatus('Unable to save your resume right now.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      const saved = await persistResume();
      await downloadResumePdf(saved._id);
      setStatus('Resume saved and PDF download started.');
    } catch {
      setStatus('Unable to save and download your resume right now.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    formData, skillInput, isSaving, isLoading, status,
    updatePersonalDetails, updateSummary, setTemplate,
    setSkillInput, addSkill, removeSkill,
    updateArrayItem, addArrayItem, removeArrayItem,
    handleSave, handleDownload,
  };
}
