export interface Post {
  userId: number;
  content: string;
  privacy: string;
  originalPostIid?: number | null;
  updated_by?: number | null;
}
