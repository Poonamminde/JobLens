import axiosInstance from './axiosInstance';
import type { JobApplication, JobFormData, JobStats } from '../types/jobApplication';

interface ListResponse { success: boolean; count: number; data: JobApplication[] }
interface SingleResponse { success: boolean; data: JobApplication }
interface StatsResponse { success: boolean; data: JobStats }

export interface JobFilters {
  search?: string;
  status?: string;
  platform?: string;
  location?: string;
  sort?: 'date_asc' | 'date_desc';
}

export async function fetchJobs(filters: JobFilters = {}): Promise<JobApplication[]> {
  const params = new URLSearchParams();
  if (filters.search)   params.set('search',   filters.search);
  if (filters.status)   params.set('status',   filters.status);
  if (filters.platform) params.set('platform', filters.platform);
  if (filters.location) params.set('location', filters.location);
  if (filters.sort)     params.set('sort',     filters.sort);
  const { data } = await axiosInstance.get<ListResponse>(`/jobs?${params.toString()}`);
  return data.data;
}

export async function fetchStats(): Promise<JobStats> {
  const { data } = await axiosInstance.get<StatsResponse>('/jobs/stats');
  return data.data;
}

export async function fetchJob(id: string): Promise<JobApplication> {
  const { data } = await axiosInstance.get<SingleResponse>(`/jobs/${id}`);
  return data.data;
}

function toPayload(form: JobFormData) {
  return {
    jobTitle:       form.jobTitle,
    companyName:    form.companyName,
    jobDescription: form.jobDescription,
    jobLocation:    form.jobLocation,
    employmentType: form.employmentType,
    salaryRange: {
      min:      form.salaryMin ? Number(form.salaryMin) : undefined,
      max:      form.salaryMax ? Number(form.salaryMax) : undefined,
      currency: form.currency || 'INR',
    },
    skillsRequired: form.skillsRequired,
    jobUrl:          form.jobUrl,
    platformSource:  form.platformSource,
    recruiterEmail:  form.recruiterEmail,
    applicationDate: form.applicationDate,
    status:          form.status,
    notes:           form.notes,
  };
}

export async function createJob(form: JobFormData): Promise<JobApplication> {
  const { data } = await axiosInstance.post<SingleResponse>('/jobs', toPayload(form));
  return data.data;
}

export async function updateJob(id: string, form: JobFormData): Promise<JobApplication> {
  const { data } = await axiosInstance.put<SingleResponse>(`/jobs/${id}`, toPayload(form));
  return data.data;
}

export async function deleteJob(id: string): Promise<void> {
  await axiosInstance.delete(`/jobs/${id}`);
}
