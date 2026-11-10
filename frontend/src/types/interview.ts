export type InterviewType = "Technical" | "HR";
export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ResumeOption { id: number; name: string; }

export interface CompanyOption {
  id: number;
  name: string;
  topics: string[];
}

export interface SetupOptions {
  roles: string[];
  topics: string[];
  resumes: ResumeOption[];
  companies: CompanyOption[];
}

export interface CreateSessionRequest {
  role: string;
  type: InterviewType;
  difficulty: Difficulty;
  topics: string[];
  resumeId: number | null;
  companyTemplateId: number | null;
}

export type AnswerSource = "TYPED" | "VOICE";

export interface InterviewSessionInfo {
  id: number;
  role: string;
  type: InterviewType;
}

export interface InterviewQuestion {
  id: number;
  text: string;
  number: number;
  total: number;
  isFollowUp: boolean;
  difficulty: Difficulty;
  timeLimitSeconds: number;
  difficultyNote: string | null;
}

export interface SubmitAnswerRequest {
  questionId: number;
  text: string;
  source: AnswerSource;
}