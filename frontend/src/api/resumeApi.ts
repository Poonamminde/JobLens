import axiosInstance from './axiosInstance';
import type { ResumeFormData } from '../types/resume';

export const getResumes = async () => {
  const response = await axiosInstance.get('/resumes');
  return response.data.data ?? [];
};

export const createResume = async (payload: ResumeFormData) => {
  const response = await axiosInstance.post('/resumes', payload);
  return response.data.data;
};

export const downloadResumePdf = async (resumeId: string) => {
  const response = await axiosInstance.get(`/resumes/${resumeId}/download`, {
    responseType: 'blob',
  });

  const blob = new Blob([response.data], { type: 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume-${resumeId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
