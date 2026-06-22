import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppMutation, useAppQuery } from "../../../lib/react-query";
import { courseSchema } from "../../../schema/courseSchema";
import { toast } from "react-toastify";
import {
    Globe,
    GraduationCap,
    DollarSign,
    Image as ImageIcon,
    AlignLeft,
    Type,
    UploadCloud,
    Loader2,
    X,
    AlertCircle,
    CheckCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
interface AddCoursesProps {
    onClose?: () => void;
}

interface Language {
    id: string | number;
    name: string;
    code: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
    deletedBy?: string | null;
}

export default function AddCourses({ onClose }: AddCoursesProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);
    const queryClient = useQueryClient();
    const navigate = useNavigate()
    const { data: languagesData, isLoading: loadingLanguages } = useAppQuery<Language[]>({
        url: "/languages",
        queryKey: ["languages"],
    });

    const languages = Array.isArray(languagesData) ? languagesData : [];

    const { mutate, isPending: isCreating } = useAppMutation({
        url: "/courses",
        type: "post",
        onSuccess: () => {
            toast.success("Course created successfully! 🎉");
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            if (onClose) {
                onClose();
            } else {
                navigate('/courses/categories');
            }
        },
        onError: (error) => {
            console.error("Failed to save course:", error);
            toast.error("An error occurred while creating the course.");
        },
    });

    const initialValues = {
        title: "",
        description: "",
        level: "Beginner",
        price: "",
        languageid: languages.length > 0 ? String(languages[0].id) : "",
        isPublished: false,
        thumbnailid: "",
    };

    const processImageFile = async (
        file: File,
        setFieldValue: (field: string, value: any) => void
    ) => {
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.warn("Image file is too large. Must be under 5MB.");
            return;
        }

        setPreviewUrl(URL.createObjectURL(file));
        setUploading(true);

        const formData = new FormData();
        formData.append("images", file);

        try {
            const baseURL = import.meta.env.VITE_API_URL || "";
            const response = await axios.post(`${baseURL}/fileupload/image`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const uploadedId = response.data?.id || response.data?.thumbnailid;

            if (uploadedId) {
                setFieldValue("thumbnailid", uploadedId);
                toast.success("Thumbnail uploaded successfully!");
            } else {
                throw new Error("No thumbnail identifier parsed from server response.");
            }
        } catch (error) {
            console.error("Image file streaming failed:", error);
            toast.error("Failed to upload the course thumbnail. Please try again.");
            setPreviewUrl(null);
            setFieldValue("thumbnailid", "");
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = (
        event: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const file = event.target.files?.[0];
        if (file) processImageFile(file, setFieldValue);
    };

    const removeUploadedImage = (setFieldValue: (field: string, value: any) => void) => {
        setPreviewUrl(null);
        setFieldValue("thumbnailid", "");
        if (fileInputRef.current) fileInputRef.current.value = "";
        toast.info("Thumbnail removed.")
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent, setFieldValue: (field: string, value: any) => void) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            processImageFile(file, setFieldValue);
        }
    };

    return (
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validationSchema={courseSchema}
            onSubmit={(values) => {
                const submissionPayload = {
                    ...values,
                    price: Number(values.price) || 0,
                    languageid: String(values.languageid),
                };
                mutate({ data: submissionPayload });
            }}
        >
            {({ setFieldValue, values, errors, touched }) => (
                <Form className="space-y-5 text-slate-700">
                    {/* Course Title Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <Type className="w-3.5 h-3.5 text-slate-400" /> Course Title <span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="text"
                            name="title"
                            placeholder="e.g., IELTS Academic Masterclass"
                            className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${touched.title && errors.title
                                ? "border-red-300 focus:border-red-400 bg-red-50/10"
                                : "border-slate-200 focus:border-slate-400"
                                }`}
                        />
                        <ErrorMessage name="title" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                            {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                        </ErrorMessage>
                    </div>

                    {/* Description Field */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Course Description <span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="textarea"
                            name="description"
                            rows={3}
                            placeholder="Provide a professional summary of module layout variables..."
                            className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none ${touched.description && errors.description
                                ? "border-red-300 focus:border-red-400 bg-red-50/10"
                                : "border-slate-200 focus:border-slate-400"
                                }`}
                        />
                        <ErrorMessage name="description" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                            {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                        </ErrorMessage>
                    </div>

                    {/* Level, Language, and Price Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Level Select */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Target Level
                            </label>
                            <Field
                                as="select"
                                name="level"
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-slate-400 transition-all appearance-none cursor-pointer"
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </Field>
                        </div>

                        {/* Dynamic Language Dropdown Field */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-slate-400" /> Language
                            </label>
                            <div className="relative">
                                <Field
                                    as="select"
                                    name="languageid"
                                    disabled={loadingLanguages}
                                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-slate-400 transition-all appearance-none cursor-pointer disabled:opacity-60"
                                >
                                    {loadingLanguages ? (
                                        <option value="">Loading languages...</option>
                                    ) : languages.length === 0 ? (
                                        <option value="">No languages available</option>
                                    ) : (
                                        <>
                                            <option value="">Select a language</option>
                                            {languages.map((lang) => (
                                                <option key={lang.id} value={lang.id}>
                                                    {lang.name}
                                                </option>
                                            ))}
                                        </>
                                    )}
                                </Field>
                            </div>
                            <ErrorMessage name="languageid" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                                {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                            </ErrorMessage>
                        </div>

                        {/* Tuition Price Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Price (NPR) <span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="number"
                                name="price"
                                placeholder="5000"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFieldValue("price", e.target.value ? Number(e.target.value) : "")
                                }
                                className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${touched.price && errors.price
                                    ? "border-red-300 focus:border-red-400 bg-red-50/10"
                                    : "border-slate-200 focus:border-slate-400"
                                    }`}
                            />
                            <ErrorMessage name="price" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                                {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                            </ErrorMessage>
                        </div>
                    </div>

                    {/* Thumbnail section */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Course Thumbnail
                        </label>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleImageUpload(e, setFieldValue)}
                            accept="image/*"
                            className="hidden"
                        />

                        {!previewUrl ? (
                            <div
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={(e) => handleDrop(e, setFieldValue)}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dragActive
                                    ? "border-blue-500 bg-blue-50/40"
                                    : touched.thumbnailid && errors.thumbnailid
                                        ? "border-red-300 bg-red-50/5"
                                        : "border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300"
                                    }`}
                            >
                                <div className="p-2 rounded-full bg-white border border-slate-100 text-slate-400 shadow-sm">
                                    <UploadCloud className="w-4 h-4" />
                                </div>
                                <div className="text-xs text-slate-500">
                                    <span className="text-slate-800 font-medium">Click to upload</span> or drag and drop image asset
                                </div>
                                <p className="text-[10px] text-slate-400">PNG, JPG or WEBP formats supported up to 5MB</p>
                            </div>
                        ) : (
                            <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900/5 h-32 flex items-center justify-center">
                                <img src={previewUrl} alt="Preview" className="h-full w-full object-contain opacity-90" />

                                {uploading ? (
                                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white">
                                        <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
                                        <span className="text-xs font-medium tracking-wide">Uploading file...</span>
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => removeUploadedImage(setFieldValue)}
                                        className="absolute top-2 right-2 p-1 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 transition-colors shadow-sm"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )}

                        <ErrorMessage name="thumbnailid" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
                            {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                        </ErrorMessage>
                    </div>

                    {/* Visibility Switch */}
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/50 mt-2">
                        <div>
                            <span className="block text-sm font-medium text-slate-800">Publish Immediately</span>
                            <span className="block text-xs text-slate-400">Make this course instantly visible to active students.</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                                type="checkbox"
                                name="isPublished"
                                checked={values.isPublished}
                                onChange={(e) => setFieldValue("isPublished", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
                        </label>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-3 pt-2">
                        {onClose && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            id="submit-course-form"
                            disabled={isCreating || uploading}
                            className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            {isCreating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Create Course
                                </>
                            )}
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}





// import { useState, useRef, useEffect } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useAppMutation, useAppQuery } from "../../../lib/react-query";
// import { courseSchema } from "../../../schema/courseSchema";
// import { toast } from "react-toastify";
// import {
//     Globe,
//     GraduationCap,
//     DollarSign,
//     Image as ImageIcon,
//     AlignLeft,
//     Type,
//     UploadCloud,
//     Loader2,
//     X,
//     AlertCircle,
// } from "lucide-react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";

// interface AddCoursesProps {
//     onClose?: () => void;
//     initialData?: any | null; // Added support for editing payloads
// }

// interface Language {
//     id: string | number;
//     name: string;
//     code: string;
//     isActive: boolean;
//     createdAt?: string;
//     updatedAt?: string;
//     deletedAt?: string | null;
//     createdBy?: string | null;
//     updatedBy?: string | null;
//     deletedBy?: string | null;
// }

// export default function AddCourses({ onClose, initialData }: AddCoursesProps) {
//     const fileInputRef = useRef<HTMLInputElement>(null);
//     const [uploading, setUploading] = useState(false);
//     const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//     const [dragActive, setDragActive] = useState(false);
//     const queryClient = useQueryClient();
//     const navigate = useNavigate();

//     const isEditMode = !!initialData?.id;

//     const { data: languagesData, isLoading: loadingLanguages } = useAppQuery<Language[]>({
//         url: "/languages",
//         queryKey: ["languages"],
//     });

//     const languages = Array.isArray(languagesData) ? languagesData : [];

//     // Map existing initial setup thumbnails
//     useEffect(() => {
//         if (initialData?.thumbnail?.url) {
//             setPreviewUrl(initialData.thumbnail.url);
//         } else {
//             setPreviewUrl(null);
//         }
//     }, [initialData]);

//     const { mutate, isPending: isSaving } = useAppMutation({
//         url: isEditMode ? `/courses` : "/courses", 
//         type: isEditMode ? "patch" : "post", // Swaps seamlessly between mutations
//         onSuccess: () => {
//             toast.success(isEditMode ? "Course updated successfully! 🎉" : "Course created successfully! 🎉");
//             queryClient.invalidateQueries({ queryKey: ["courses"] });
//             if (onClose) {
//                 onClose();
//             } else {
//                 navigate('/courses/categories');
//             }
//         },
//         onError: (error) => {
//             console.error("Failed to save course asset configuration structural state:", error);
//             toast.error("An error occurred while matching transaction layers.");
//         },
//     });

//     // Provide prefilled elements if initialData passes
//     const initialValues = {
//         title: initialData?.title || "",
//         description: initialData?.description || "",
//         level: initialData?.level || "Beginner",
//         price: initialData?.price || "",
//         languageid: initialData?.language?.id ? String(initialData.language.id) : (languages.length > 0 ? String(languages[0].id) : ""),
//         isPublished: initialData?.isPublished || false,
//         thumbnailid: initialData?.thumbnail?.id || "",
//     };

//     const processImageFile = async (
//         file: File,
//         setFieldValue: (field: string, value: any) => void
//     ) => {
//         if (!file) return;

//         if (file.size > 5 * 1024 * 1024) {
//             toast.warn("Image file is too large. Must be under 5MB.");
//             return;
//         }

//         setPreviewUrl(URL.createObjectURL(file));
//         setUploading(true);

//         const formData = new FormData();
//         formData.append("images", file);

//         try {
//             const baseURL = import.meta.env.VITE_API_URL || "";
//             const response = await axios.post(`${baseURL}/fileupload/image`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             const uploadedId = response.data?.id || response.data?.thumbnailid;

//             if (uploadedId) {
//                 setFieldValue("thumbnailid", uploadedId);
//                 toast.success("Thumbnail uploaded successfully!");
//             } else {
//                 throw new Error("No thumbnail identifier parsed from server response.");
//             }
//         } catch (error) {
//             console.error("Image file streaming failed:", error);
//             toast.error("Failed to upload the course thumbnail. Please try again.");
//             setPreviewUrl(null);
//             setFieldValue("thumbnailid", "");
//         } finally {
//             setUploading(false);
//         }
//     };

//     const handleImageUpload = (
//         event: React.ChangeEvent<HTMLInputElement>,
//         setFieldValue: (field: string, value: any) => void
//     ) => {
//         const file = event.target.files?.[0];
//         if (file) processImageFile(file, setFieldValue);
//     };

//     const removeUploadedImage = (setFieldValue: (field: string, value: any) => void) => {
//         setPreviewUrl(null);
//         setFieldValue("thumbnailid", "");
//         if (fileInputRef.current) fileInputRef.current.value = "";
//         toast.info("Thumbnail removed.");
//     };

//     const handleDrag = (e: React.DragEvent) => {
//         e.preventDefault();
//         e.stopPropagation();
//         if (e.type === "dragenter" || e.type === "dragover") {
//             setDragActive(true);
//         } else if (e.type === "dragleave") {
//             setDragActive(false);
//         }
//     };

//     const handleDrop = (e: React.DragEvent, setFieldValue: (field: string, value: any) => void) => {
//         e.preventDefault();
//         e.stopPropagation();
//         setDragActive(false);

//         const file = e.dataTransfer.files?.[0];
//         if (file && file.type.startsWith("image/")) {
//             processImageFile(file, setFieldValue);
//         }
//     };

//     return (
//         <Formik
//             enableReinitialize={true}
//             initialValues={initialValues}
//             validationSchema={courseSchema}
//             onSubmit={(values) => {
//                 const submissionPayload = {
//                     ...values,
//                     price: Number(values.price) || 0,
//                     languageid: String(values.languageid),
//                     ...(isEditMode && { id: initialData.id }) // Inject ID if running a patch
//                 };
//                 mutate({ data: submissionPayload });
//             }}
//         >
//             {({ setFieldValue, values, errors, touched }) => (
//                 <Form className="space-y-5 text-slate-700">
//                     {/* Course Title Field */}
//                     <div className="space-y-1.5">
//                         <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
//                             <Type className="w-3.5 h-3.5 text-slate-400" /> Course Title <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                             type="text"
//                             name="title"
//                             placeholder="e.g., IELTS Academic Masterclass"
//                             className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${touched.title && errors.title
//                                 ? "border-red-300 focus:border-red-400 bg-red-50/10"
//                                 : "border-slate-200 focus:border-slate-400"
//                                 }`}
//                         />
//                         <ErrorMessage name="title" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
//                             {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
//                         </ErrorMessage>
//                     </div>

//                     {/* Description Field */}
//                     <div className="space-y-1.5">
//                         <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
//                             <AlignLeft className="w-3.5 h-3.5 text-slate-400" /> Course Description <span className="text-red-500">*</span>
//                         </label>
//                         <Field
//                             as="textarea"
//                             name="description"
//                             rows={3}
//                             placeholder="Provide a professional summary of module layout variables..."
//                             className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all resize-none ${touched.description && errors.description
//                                 ? "border-red-300 focus:border-red-400 bg-red-50/10"
//                                 : "border-slate-200 focus:border-slate-400"
//                                 }`}
//                         />
//                         <ErrorMessage name="description" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
//                             {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
//                         </ErrorMessage>
//                     </div>

//                     {/* Level, Language, and Price Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                         {/* Level Select */}
//                         <div className="space-y-1.5">
//                             <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
//                                 <GraduationCap className="w-3.5 h-3.5 text-slate-400" /> Target Level
//                             </label>
//                             <Field
//                                 as="select"
//                                 name="level"
//                                 className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-slate-400 transition-all appearance-none cursor-pointer"
//                             >
//                                 <option value="Beginner">Beginner</option>
//                                 <option value="Intermediate">Intermediate</option>
//                                 <option value="Advanced">Advanced</option>
//                             </Field>
//                         </div>

//                         {/* Language Dropdown */}
//                         <div className="space-y-1.5">
//                             <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
//                                 <Globe className="w-3.5 h-3.5 text-slate-400" /> Language
//                             </label>
//                             <div className="relative">
//                                 <Field
//                                     as="select"
//                                     name="languageid"
//                                     disabled={loadingLanguages}
//                                     className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-800 focus:outline-none focus:border-slate-400 transition-all appearance-none cursor-pointer disabled:opacity-60"
//                                 >
//                                     {loadingLanguages ? (
//                                         <option value="">Loading languages...</option>
//                                     ) : languages.length === 0 ? (
//                                         <option value="">No languages available</option>
//                                     ) : (
//                                         <>
//                                             <option value="">Select a language</option>
//                                             {languages.map((lang) => (
//                                                 <option key={lang.id} value={lang.id}>
//                                                     {lang.name}
//                                                 </option>
//                                             ))}
//                                         </>
//                                     )}
//                                 </Field>
//                             </div>
//                             <ErrorMessage name="languageid" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
//                                 {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
//                             </ErrorMessage>
//                         </div>

//                         {/* Tuition Price Input */}
//                         <div className="space-y-1.5">
//                             <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
//                                 <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Price (NPR) <span className="text-red-500">*</span>
//                             </label>
//                             <Field
//                                 type="number"
//                                 name="price"
//                                 placeholder="5000"
//                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                                     setFieldValue("price", e.target.value ? Number(e.target.value) : "")
//                                 }
//                                 className={`w-full px-3.5 py-2 rounded-xl border text-sm bg-slate-50/50 text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${touched.price && errors.price
//                                     ? "border-red-300 focus:border-red-400 bg-red-50/10"
//                                     : "border-slate-200 focus:border-slate-400"
//                                     }`}
//                             />
//                             <ErrorMessage name="price" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
//                                 {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
//                             </ErrorMessage>
//                         </div>
//                     </div>

//                     {/* Thumbnail section */}
//                     <div className="space-y-1.5">
//                         <label className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
//                             <ImageIcon className="w-3.5 h-3.5 text-slate-400" /> Course Thumbnail
//                         </label>

//                         <input
//                             type="file"
//                             ref={fileInputRef}
//                             onChange={(e) => handleImageUpload(e, setFieldValue)}
//                             accept="image/*"
//                             className="hidden"
//                         />

//                         {!previewUrl ? (
//                             <div
//                                 onDragEnter={handleDrag}
//                                 onDragLeave={handleDrag}
//                                 onDragOver={handleDrag}
//                                 onDrop={(e) => handleDrop(e, setFieldValue)}
//                                 onClick={() => !uploading && fileInputRef.current?.click()}
//                                 className={`border border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${dragActive
//                                     ? "border-blue-500 bg-blue-50/40"
//                                     : touched.thumbnailid && errors.thumbnailid
//                                         ? "border-red-300 bg-red-50/5"
//                                         : "border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-300"
//                                     }`}
//                             >
//                                 <div className="p-2 rounded-full bg-white border border-slate-100 text-slate-400 shadow-sm">
//                                     <UploadCloud className="w-4 h-4" />
//                                 </div>
//                                 <div className="text-xs text-slate-500">
//                                     <span className="text-slate-800 font-medium">Click to upload</span> or drag and drop image asset
//                                 </div>
//                                 <p className="text-[10px] text-slate-400">PNG, JPG or WEBP formats supported up to 5MB</p>
//                             </div>
//                         ) : (
//                             <div className="relative rounded-xl border border-slate-200 overflow-hidden bg-slate-900/5 h-32 flex items-center justify-center">
//                                 <img src={previewUrl} alt="Preview" className="h-full w-full object-contain opacity-90" />

//                                 {uploading ? (
//                                     <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white">
//                                         <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
//                                         <span className="text-xs font-medium tracking-wide">Uploading file...</span>
//                                     </div>
//                                 ) : (
//                                     <button
//                                         type="button"
//                                         onClick={() => removeUploadedImage(setFieldValue)}
//                                         className="absolute top-2 right-2 p-1 rounded-lg bg-slate-900/80 text-white hover:bg-slate-900 transition-colors shadow-sm"
//                                     >
//                                         <X className="w-3.5 h-3.5" />
//                                     </button>
//                                 )}
//                             </div>
//                         )}

//                         <ErrorMessage name="thumbnailid" component="div" className="text-red-500 text-[11px] mt-0.5 flex items-center gap-1">
//                             {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
//                         </ErrorMessage>
//                     </div>

//                     {/* Visibility Switch */}
//                     <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/50 mt-2">
//                         <div>
//                             <span className="block text-sm font-medium text-slate-800">Publish Immediately</span>
//                             <span className="block text-xs text-slate-400">Make this course instantly visible to active students.</span>
//                         </div>
//                         <label className="relative inline-flex items-center cursor-pointer select-none">
//                             <input
//                                 type="checkbox"
//                                 name="isPublished"
//                                 checked={values.isPublished}
//                                 onChange={(e) => setFieldValue("isPublished", e.target.checked)}
//                                 className="sr-only peer"
//                             />
//                             <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-slate-900"></div>
//                         </label>
//                     </div>

//                     {/* Form Actions */}
//                     <div className="flex gap-3 pt-2">
//                         {onClose && (
//                             <button
//                                 type="button"
//                                 onClick={onClose}
//                                 className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                         )}
//                         <button
//                             type="submit"
//                             disabled={isSaving || uploading}
//                             className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                         >
//                             {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
//                             {isEditMode ? "Update Course Configuration" : "Save Course Matrix"}
//                         </button>
//                     </div>
//                 </Form>
//             )}
//         </Formik>
//     );
// }