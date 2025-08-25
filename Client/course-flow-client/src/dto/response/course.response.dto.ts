export interface CourseResponse {
  course_id: number;
  slug: string;
  description: string;
  thumbnail_url: string;
  price: number;
  language: string;
  level: string;
  created_at: Date;
  updated_at: Date;
}
