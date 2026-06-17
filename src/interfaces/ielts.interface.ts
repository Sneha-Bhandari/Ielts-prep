// export interface Thumbnail {
//   id: string; 
//   url: string;
//   key: string;
//  mimeType?: string;
//   size?: number;
//   type?: string;
// }

// export interface IeltsType {
//   id: string;
//   name?: string;
//   // description?: string;
// }

// export interface Lesson {
//   id?: string;

//   section: string;

//   title: string;
//   content: string;

//   videoId: string;

//   duration: number;
//   order: number;
// }




// export interface Section {
//   id: string;

//   course?: {
//     id: string;
//     title?: string;
//   } | null;

//   ielts?: {
//     id: string;
//     title?: string;
//   };

//   title: string;
//   description: string;
//   orderNo: number;

//   lessons?: Lesson[];
// }


// export interface IeltsCourse {
//   id?: string;

//   title: string;
//   description: string;

//   ieltsType: IeltsType;

//   thumbnail: Thumbnail;

//   isPublished: boolean;
//   price: number | string;

//   sections?: Section[];
// }



// export interface CreateIeltsCourseDto {
//   title: string;
//   description: string;

//   ieltsTypeid: string;
//   thumbnailid: string;

//   isPublished: boolean;
//   price: number;
// }

// /* ===========================
//    PUT /ielts/:id REQUEST
// =========================== */

// export interface UpdateIeltsCourseDto {
//   title?: string;
//   description?: string;

//   ieltsTypeid?: string;
//   thumbnailid?: string;

//   isPublished?: boolean;
//   price?: number;
// }

// /* ===========================
//    FORMS
// =========================== */

// export interface CourseFormData {
//   title: string;
//   description: string;

//   ieltsTypeid: string;
//   thumbnailid: string;

//   isPublished: boolean;
//   price: number;
// }

// export interface SectionFormData
//   extends Omit<Section, "id" | "lessons"> {}

// export interface LessonFormData
//   extends Omit<Lesson, "id"> {}

export interface Thumbnail {
  id: string; 
  url: string;
  key: string;
  mimeType?: string;
  size?: number;
  type?: string;
}

export interface IeltsType {
  id: string;
  name?: string;
  // description?: string;
}

export interface Video {
  id: string;
  url: string;
  key: string;
  mimeType?: string;
  size?: number;
  type?: string;
}

export interface Lesson {
  id?: string;
  section: string;
  title: string;
  content: string;
  videoId: Video;  // Changed from string to Video object
  duration: number;
  order: number;
}

export interface Section {
  id: string;
  course?: {
    id: string;
    title?: string;
  } | null;
  ielts?: {
    id: string;
    title?: string;
  };
  title: string;
  description: string;
  orderNo: number;
  lessons?: Lesson[];
}

export interface IeltsCourse {
  id?: string;
  title: string;
  description: string;
  ieltsType: IeltsType;
  thumbnail: Thumbnail;
  isPublished: boolean;
  price: number | string;
  sections?: Section[];
}

export interface CreateIeltsCourseDto {
  title: string;
  description: string;
  ieltsTypeid: string;
  thumbnailid: string;
  isPublished: boolean;
  price: number;
}

export interface UpdateIeltsCourseDto {
  title?: string;
  description?: string;
  ieltsTypeid?: string;
  thumbnailid?: string;
  isPublished?: boolean;
  price?: number;
}

export interface CourseFormData {
  title: string;
  description: string;
  ieltsTypeid: string;
  thumbnailid: string;
  isPublished: boolean;
  price: number;
}

export interface SectionFormData extends Omit<Section, "id" | "lessons"> {}

export interface LessonFormData extends Omit<Lesson, "id"> {}