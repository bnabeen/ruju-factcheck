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

export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export interface FactCheckArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  verdict: VerdictType;
  status: ArticleStatus;
  date: string;
  author: string;
  category: string;
  imageUrl?: string;
  title_en?: string;
  title_np?: string;
  summary_en?: string;
  summary_np?: string;
  content_en?: string;
  content_np?: string;
  image_url?: string;
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
