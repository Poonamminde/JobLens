import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import { AppError } from '../middleware/errorHandler.js';
import { buildResumePdf } from '../utils/resumeTemplates.js';

function getUserId(req: Request): mongoose.Types.ObjectId {
  if (!req.user) throw new AppError('Not authorized', 401);
  return req.user._id as mongoose.Types.ObjectId;
}

export const createResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);
    const existingResume = await Resume.findOne({ userId });

    const resume = await Resume.findOneAndUpdate(
      { userId },
      { ...req.body, userId },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      }
    );

    await Resume.deleteMany({ userId, _id: { $ne: resume._id } });

    res.status(existingResume ? 200 : 201).json({ success: true, data: resume });
  } catch (error) {
    next(error);
  }
};

export const getResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);
    const resume = await Resume.findOne({ userId }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: resume ? 1 : 0, data: resume ? [resume] : [] });
  } catch (error) {
    next(error);
  }
};

export const downloadResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);
    const resume = await Resume.findOne({ _id: req.params['id'], userId }).lean();

    if (!resume) {
      next(new AppError('Resume not found', 404));
      return;
    }

    const pdfBuffer = await buildResumePdf(resume as never);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resume.selectedTemplate || 'resume'}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
};
