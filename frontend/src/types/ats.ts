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
