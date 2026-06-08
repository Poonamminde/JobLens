import { GoogleGenAI } from '@google/genai';

if (!process.env['GEMINI_API_KEY']) {
  console.warn('⚠️  GEMINI_API_KEY is not set. ATS analysis will fail.');
}

const ai = new GoogleGenAI({ apiKey: process.env['GEMINI_API_KEY'] ?? '' });

export interface AtsScoreBreakdown {
  keywordMatch: number;
  skillsAlignment: number;
  experienceRelevance: number;
  formatReadability: number;
}

export interface AtsReport {
  atsScore: number;
  scoreBreakdown: AtsScoreBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  optimizedSummary: string;
}

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst and career coach with 15+ years of experience in recruitment and resume optimization.

Analyze the provided resume against the job description and return a comprehensive ATS compatibility report.

IMPORTANT: Return ONLY a valid JSON object — no markdown, no code fences, no explanation text. The JSON must strictly follow this schema:

{
  "atsScore": <integer 0-100>,
  "scoreBreakdown": {
    "keywordMatch": <integer 0-100>,
    "skillsAlignment": <integer 0-100>,
    "experienceRelevance": <integer 0-100>,
    "formatReadability": <integer 0-100>
  },
  "matchedKeywords": [<strings found in both resume and JD, max 20>],
  "missingKeywords": [<important JD keywords absent from resume, max 15>],
  "strengths": [<4-6 specific resume strengths relevant to this JD>],
  "weaknesses": [<3-5 specific gaps or weaknesses for this JD>],
  "suggestions": [<5-7 concrete, actionable improvement suggestions>],
  "optimizedSummary": "<a 3-4 sentence ATS-optimized professional summary tailored to this JD, ready to paste>"
}

Scoring:
- keywordMatch: % of important JD keywords found verbatim in the resume
- skillsAlignment: how well the candidate skills match required/preferred skills in JD
- experienceRelevance: how relevant past roles/projects are to this position
- formatReadability: ATS parseability (penalise tables, graphics, image-based headers)
- atsScore: weighted average (keywords 35%, skills 30%, experience 25%, format 10%)`;

function truncate(text: string, maxChars: number): string {
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n...[content truncated]` : text;
}

function clamp(n: number): number {
  return Math.min(100, Math.max(0, Math.round(n)));
}

export async function generateAtsReport(resumeText: string, jdText: string): Promise<AtsReport> {
  const prompt = `RESUME:\n${truncate(resumeText, 5000)}\n\n---\nJOB DESCRIPTION:\n${truncate(jdText, 3000)}`;

  const response = await ai.models.generateContent({
    model: process.env['GEMINI_MODEL'] ?? 'gemini-2.5-flash-lite',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const raw = (response.text ?? '').trim();
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

  let report: AtsReport;
  try {
    report = JSON.parse(cleaned) as AtsReport;
  } catch {
    throw new Error('Gemini returned malformed JSON. Please try again.');
  }

  // Normalise
  report.atsScore = clamp(report.atsScore);
  report.scoreBreakdown.keywordMatch = clamp(report.scoreBreakdown.keywordMatch);
  report.scoreBreakdown.skillsAlignment = clamp(report.scoreBreakdown.skillsAlignment);
  report.scoreBreakdown.experienceRelevance = clamp(report.scoreBreakdown.experienceRelevance);
  report.scoreBreakdown.formatReadability = clamp(report.scoreBreakdown.formatReadability);

  return report;
}
