export interface Lesson {
  id?: number;
  section: string;
  title: string;
  content: string;
  video_url: string;
  video_url_key: string;
  duration: number;
  order_no: number;
}

export interface IeltsCourse {
  id: number;
  title: string;
  type: "Academic" | "GT" | "UKVI";
  isPublished: boolean;
  description: string;
  image: string;
  lessons: Lesson[];
}

export interface CourseFormData extends Omit<IeltsCourse, "id"> {}