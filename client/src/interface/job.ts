export interface Job {
  jobsTableId: number;
  email: string;
  name: string;
  userId: string;
  title: string;
  location: string;
  salary: string;
  employmentType: string;
  categoryType: string;
  requiredSkills: string;
  experienceLevel: string;
  applicationDeadline: string;
  description: string;
}

export interface JobFilter {
  categoryType: string;
  location?: string;
  salary: string;
  employmentType: "Full-time" | "Part-time";
  experienceLevel: string;
}
