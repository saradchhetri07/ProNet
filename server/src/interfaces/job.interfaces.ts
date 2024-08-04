export interface Job {
  userId: number;
  title: string;
  description: string;
  location: string;
  salary?: number;
  employmentType: "Full-time" | "Part-time";
  categoryType: string;
  requiredSkills?: string;
  experienceLevel?: string;
  postedAt: Date;
  updatedAt: Date;
  applicationDeadline?: string;
}

export interface JobCategory {
  categoryId: number;
  name: string;
  description?: string;
}

export interface JobFilter {
  categoryType?: string;
  location?: string;
  salary?: string;
  employmentType?: "Full-time" | "Part-time";
  experienceLevel?: string;
}
