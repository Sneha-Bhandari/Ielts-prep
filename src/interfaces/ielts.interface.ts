export interface Lesson {
  id?: string;

  section: string;

  title: string;
  content: string;

  video_url: string;
  video_url_key: string;

  duration: number;
  order_no: number;
}

export interface Section {
  id?: string;
  ielts?: string | null;

  title: string;
  description: string;

  orderNo: number;

  lessons?: Lesson[];
}

export interface IeltsCourse {
  id?: string;

  title: string;
  description: string;

  // type: string;
   ieltsType: {
    id: string;
  };

  thumbnail: string;
  thumbnailKey: string;

  isPublished: boolean;
  price: number;

  sections?: Section[];
}

export interface CourseFormData
  extends Omit<IeltsCourse, "id" | "sections"> {}

export interface SectionFormData
  extends Omit<Section, "id" | "lessons"> {}

export interface LessonFormData
  extends Omit<Lesson, "id"> {}