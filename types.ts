export enum Language {
  EN = 'EN',
  NP = 'NP'
}

export enum VerdictType {
  TRUE = 'True',
  FALSE = 'False',
  MISLEADING = 'Misleading',
  UNVERIFIED = 'Unverified'
}

export interface FactCheckArticle {
  id: string;
  title: string;
  summary: string;
  verdict: VerdictType;
  date: string;
  author: string;
  category: string;
  imageUrl?: string;
}

export interface AnalysisSource {
  title: string;
  uri: string;
}

export interface AIAnalysisResult {
  verdict: VerdictType;
  confidence: number;
  summary: string;
  sources: AnalysisSource[];
  reasoning: string;
}
