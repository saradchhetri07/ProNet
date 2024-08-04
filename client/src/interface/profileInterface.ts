export interface ProfileInterface {
  headline: string;
  summary: string;
  industry: string;
  currentPosition: string;
  currentCompany: string;
  experience: string;
}

export interface ProfileDetailsInterface {
  currentCompany?: string;
  currentPosition?: string;
  experience?: string;
  headline?: string;
  industry?: string;
  summary?: string;
}
