export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';

export type ApplicationStatus =
  | 'Saved'
  | 'Applied'
  | 'Interview Scheduled'
  | 'Technical Round'
  | 'HR Round'
  | 'Offer Received'
  | 'Rejected'
  | 'Withdrawn';

export type PlatformSource =
  | 'LinkedIn'
  | 'Naukri'
  | 'Indeed'
  | 'Wellfound'
  | 'Glassdoor'
  | 'Company Website'
  | 'Referral'
  | 'Other';

export interface SalaryRange {
  min?: number;
  max?: number;
  currency: string;
}

export interface JobApplication {
  _id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  jobLocation: string;
  employmentType: EmploymentType;
  salaryRange: SalaryRange;
  skillsRequired: string[];
  jobUrl?: string;
  platformSource: PlatformSource | string;
  recruiterEmail?: string;
  applicationDate: string;
  status: ApplicationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  jobLocation: string;
  employmentType: EmploymentType;
  salaryMin: string;
  salaryMax: string;
  currency: string;
  skillsRequired: string[];
  jobUrl: string;
  platformSource: string;
  recruiterEmail: string;
  applicationDate: string;
  status: ApplicationStatus;
  notes: string;
}

export interface JobStats {
  total: number;
  applied: number;
  interviews: number;
  offers: number;
  rejected: number;
}

export const STATUSES: ApplicationStatus[] = [
  'Saved', 'Applied', 'Interview Scheduled', 'Technical Round',
  'HR Round', 'Offer Received', 'Rejected', 'Withdrawn',
];

export const PLATFORMS: PlatformSource[] = [
  'LinkedIn', 'Naukri', 'Indeed', 'Wellfound', 'Glassdoor',
  'Company Website', 'Referral', 'Other',
];

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  'Full-time', 'Part-time', 'Contract', 'Internship',
];

export const STATUS_STYLES: Record<ApplicationStatus, { bg: string; text: string; dot: string }> = {
  'Saved':               { bg: 'bg-indigo-500/15',  text: 'text-indigo-300',  dot: 'bg-indigo-400' },
  'Applied':             { bg: 'bg-blue-500/15',     text: 'text-blue-300',    dot: 'bg-blue-400' },
  'Interview Scheduled': { bg: 'bg-amber-500/15',    text: 'text-amber-300',   dot: 'bg-amber-400' },
  'Technical Round':     { bg: 'bg-orange-500/15',   text: 'text-orange-300',  dot: 'bg-orange-400' },
  'HR Round':            { bg: 'bg-purple-500/15',   text: 'text-purple-300',  dot: 'bg-purple-400' },
  'Offer Received':      { bg: 'bg-green-500/15',    text: 'text-green-300',   dot: 'bg-green-400' },
  'Rejected':            { bg: 'bg-red-500/15',      text: 'text-red-300',     dot: 'bg-red-400' },
  'Withdrawn':           { bg: 'bg-slate-500/15',    text: 'text-slate-400',   dot: 'bg-slate-500' },
};
