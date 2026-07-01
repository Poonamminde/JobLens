import mongoose, { Schema, type Document } from 'mongoose';

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  personalDetails: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    portfolio: string;
  };
  professionalSummary: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  projects: Array<{
    name: string;
    techStack: string;
    link: string;
    description: string;
  }>;
  selectedTemplate: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personalDetails: {
      fullName: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      linkedin: { type: String, trim: true, default: '' },
      github: { type: String, trim: true, default: '' },
      portfolio: { type: String, trim: true, default: '' },
    },
    professionalSummary: { type: String, trim: true, default: '' },
    skills: [{ type: String, trim: true }],
    experience: [{
      company: { type: String, trim: true, default: '' },
      role: { type: String, trim: true, default: '' },
      startDate: { type: String, trim: true, default: '' },
      endDate: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
    }],
    education: [{
      institution: { type: String, trim: true, default: '' },
      degree: { type: String, trim: true, default: '' },
      year: { type: String, trim: true, default: '' },
    }],
    projects: [{
      name: { type: String, trim: true, default: '' },
      techStack: { type: String, trim: true, default: '' },
      link: { type: String, trim: true, default: '' },
      description: { type: String, trim: true, default: '' },
    }],
    selectedTemplate: { type: String, trim: true, default: 'minimalist' },
  },
  { timestamps: true }
);

resumeSchema.index({ userId: 1 }, { unique: true });

const Resume = mongoose.model<IResume>('Resume', resumeSchema);

export default Resume;
