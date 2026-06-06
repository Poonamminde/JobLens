import mongoose, { Document, Schema, type Types } from 'mongoose';

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

export interface IJobApplication extends Document {
  userId: Types.ObjectId;
  jobTitle: string;
  companyName: string;
  jobDescription?: string;
  jobLocation: string;
  employmentType: EmploymentType;
  salaryRange: {
    min?: number;
    max?: number;
    currency: string;
  };
  skillsRequired: string[];
  jobUrl?: string;
  platformSource: PlatformSource | string;
  recruiterEmail?: string;
  applicationDate: Date;
  status: ApplicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobTitle: { type: String, required: [true, 'Job title is required'], trim: true, maxlength: 150 },
    companyName: { type: String, required: [true, 'Company name is required'], trim: true, maxlength: 100 },
    jobDescription: { type: String, trim: true },
    jobLocation: { type: String, required: [true, 'Job location is required'], trim: true },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'INR' },
    },
    skillsRequired: [{ type: String, trim: true }],
    jobUrl: { type: String, trim: true },
    platformSource: { type: String, default: 'Other' },
    recruiterEmail: { type: String, trim: true, lowercase: true },
    applicationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['Saved', 'Applied', 'Interview Scheduled', 'Technical Round', 'HR Round', 'Offer Received', 'Rejected', 'Withdrawn'],
      default: 'Saved',
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

// Compound index for fast per-user filtered queries
jobApplicationSchema.index({ userId: 1, status: 1 });
jobApplicationSchema.index({ userId: 1, applicationDate: -1 });

const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
export default JobApplication;
