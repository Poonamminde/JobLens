import axiosInstance from './axiosInstance';
import type { AtsReport } from '../types/ats';

interface AtsResponse { success: boolean; data: AtsReport }

export async function analyzeResume(file: File, jobDescription: string): Promise<AtsReport> {
  const form = new FormData();
  form.append('resume', file);
  form.append('jobDescription', jobDescription);

  const { data } = await axiosInstance.post<AtsResponse>('/ats/analyze', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
}
