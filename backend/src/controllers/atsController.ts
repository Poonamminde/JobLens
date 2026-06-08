import type { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import PDFParser from 'pdf2json';
import mammoth from 'mammoth';
import { generateAtsReport } from '../lib/gemini.js';
import { AppError } from '../middleware/errorHandler.js';

export const resumeUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new AppError('Only PDF and DOCX files are accepted', 400));
    }
  },
});

function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser(null, true);
    parser.on('pdfParser_dataReady', () => {
      resolve(parser.getRawTextContent());
    });
    parser.on('pdfParser_dataError', (err: Error | { parserError: Error }) => {
      const msg = err instanceof Error ? err.message : err.parserError.message;
      reject(new AppError(`PDF parse error: ${msg}`, 422));
    });
    parser.parseBuffer(buffer);
  });
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

async function extractText(file: Express.Multer.File): Promise<string> {
  if (file.mimetype === 'application/pdf') {
    return extractPdfText(file.buffer);
  }
  return extractDocxText(file.buffer);
}

export const analyzeResume = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const file = req.file;
    
    if (!file) {
      next(new AppError('Resume file is required', 400));
      return;
    }

    const jobDescription = (req.body as { jobDescription?: string }).jobDescription?.trim() ?? '';
    if (!jobDescription || jobDescription.length < 50) {
      next(new AppError('Job description must be at least 50 characters', 400));
      return;
    }

    if (!process.env['GEMINI_API_KEY']) {
      next(new AppError('Gemini API key is not configured on the server', 503));
      return;
    }

    const resumeText = await extractText(file);

    if (!resumeText.trim()) {
      next(new AppError('Could not extract text from your resume. Please ensure the file is not image-based.', 422));
      return;
    }

    const report = await generateAtsReport(resumeText, jobDescription);

    res.json({ success: true, data: report });
  } catch (err) {
    console.error('ATS analysis error:', err);
    next(err);
  }
};
