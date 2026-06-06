import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import JobApplication from '../models/JobApplication.js';
import { AppError } from '../middleware/errorHandler.js';

function getUserId(req: Request): mongoose.Types.ObjectId {
  if (!req.user) throw new AppError('Not authorized', 401);
  return req.user._id as mongoose.Types.ObjectId;
}

// ─── GET /api/jobs/:id ─────────────────────────────────────────────────────────
export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);
    const job = await JobApplication.findOne({ _id: req.params['id'], userId }).lean();
    if (!job) {
      next(new AppError('Job application not found', 404));
      return;
    }
    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/jobs ─────────────────────────────────────────────────────────────
export const getJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);
    const { search, status, platform, location, sort } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = { userId };

    if (status) filter['status'] = status;
    if (platform) filter['platformSource'] = platform;
    if (location) filter['jobLocation'] = { $regex: location, $options: 'i' };

    if (search) {
      filter['$or'] = [
        { jobTitle:    { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { skillsRequired: { $elemMatch: { $regex: search, $options: 'i' } } },
      ];
    }

    const sortOrder = sort === 'date_asc' ? { applicationDate: 1 } : { applicationDate: -1 };

    const jobs = await JobApplication.find(filter).sort(sortOrder as Record<string, 1 | -1>).lean();

    res.json({ success: true, count: jobs.length, data: jobs });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/jobs/stats ───────────────────────────────────────────────────────
export const getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);

    const pipeline = [
      { $match: { userId: new mongoose.Types.ObjectId(userId.toString()) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ];

    const results = await JobApplication.aggregate<{ _id: string; count: number }>(pipeline);

    const stats: Record<string, number> = {
      total: 0,
      applied: 0,
      interviews: 0,
      offers: 0,
      rejected: 0,
    };

    for (const r of results) {
      stats['total'] += r.count;
      if (r._id === 'Applied') stats['applied'] = r.count;
      if (['Interview Scheduled', 'Technical Round', 'HR Round'].includes(r._id)) stats['interviews'] += r.count;
      if (r._id === 'Offer Received') stats['offers'] = r.count;
      if (r._id === 'Rejected') stats['rejected'] = r.count;
    }

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/jobs ────────────────────────────────────────────────────────────
export const createJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);
    const job = await JobApplication.create({ ...req.body, userId });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/jobs/:id ─────────────────────────────────────────────────────────
export const updateJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);

    const job = await JobApplication.findOneAndUpdate(
      { _id: req.params['id'], userId },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!job) {
      next(new AppError('Job application not found', 404));
      return;
    }

    res.json({ success: true, data: job });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/jobs/:id ──────────────────────────────────────────────────────
export const deleteJob = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = getUserId(req);

    const job = await JobApplication.findOneAndDelete({ _id: req.params['id'], userId });

    if (!job) {
      next(new AppError('Job application not found', 404));
      return;
    }

    res.json({ success: true, message: 'Job application deleted' });
  } catch (err) {
    next(err);
  }
};
