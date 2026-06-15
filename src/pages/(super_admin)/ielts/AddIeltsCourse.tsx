import { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, Upload, BookOpen, DollarSign, Globe, Layers, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { useAppMutation, useAppQuery } from "../../../lib/react-query";
import { useIELTSStore } from "../../../store/ielts.store";
import { ieltsCourseSchema } from "../../../schema/ieltsSchema";

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || "http://192.168.1.78:3008";

export default function AddIeltsCourse({ onClose }: { onClose: () => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    
    const addCourse = useIELTSStore((state) => state.addCourse);

    const { data: ieltsTypesData, isLoading: isLoadingTypes } = useAppQuery<any[]>({
        url: "/ielts-types",
        queryKey: ["ieltsTypes"],
    });

    const { mutate, isPending } = useAppMutation({
        url: "/ielts",
        type: "post",
        onSuccess: (data) => {
            if (data) {
                addCourse(data);
            }
            onClose();
        },
        onError: (err: any) => {
            const errorMessage = err.response?.data?.message || err.message || "Failed to create course";
            setUploadError(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
        },
    });

    const initialValues = {
        title: "",
        description: "",
        ieltsTypeid: "", 
        thumbnailid: "",
        isPublished: false,
        price: 0,
    };

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const uploadThumbnail = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("images", file);
        formData.append("file", file);

        const response = await fetch(`${API_BASE_URL}/fileupload/image`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.status}`);
        }

        const result = await response.json();
        const fileId = result.id || result.fileId || result._id;
        
        if (!fileId) {
            throw new Error("No ID returned from upload server");
        }
        
        return fileId;
    };

    const handleFileUpload = async (
        file: File,
        setFieldValue: (field: string, value: any) => void
    ) => {
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setUploadError("Image must be under 5MB");
            return;
        }

        if (!file.type.startsWith('image/')) {
            setUploadError("Please upload an image file");
            return;
        }

        setUploadError("");
        setIsUploading(true);

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        try {
            const fileId = await uploadThumbnail(file);
            setFieldValue("thumbnailid", fileId);
        } catch (error: any) {
            setUploadError(error.message || "Failed to upload thumbnail");
            setImagePreview("");
            setFieldValue("thumbnailid", "");
        } finally {
            setIsUploading(false);
        }
    };

    const handleImageUpload = async (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleFileUpload(file, setFieldValue);
        }
    };

    const handleRemoveImage = (setFieldValue: (field: string, value: any) => void) => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview("");
        setFieldValue("thumbnailid", "");
        setUploadError("");
        if (fileInputRef.current) fileInputRef.current.value = "";
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

    const handleDrop = async (e: React.DragEvent, setFieldValue: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            await handleFileUpload(file, setFieldValue);
        } else if (file) {
            setUploadError("Please upload an image file");
        }
    };

    const handleSubmit = async (values: typeof initialValues, { resetForm, setSubmitting }: any) => {
        if (!values.title || !values.description || !values.ieltsTypeid || !values.thumbnailid) {
            setUploadError("All fields are required");
            setSubmitting(false);
            return;
        }
        
        const payload = {
            title: values.title,
            description: values.description,
            ieltsTypeid: values.ieltsTypeid,
            thumbnailid: values.thumbnailid,
            isPublished: Boolean(values.isPublished),
            price: Number(values.price),
        };
        
        mutate({ data: payload }, {
            onSuccess: () => {
                resetForm();
                setImagePreview("");
                setUploadError("");
                setSubmitting(false);
            },
            onError: () => {
                setSubmitting(false);
            }
        });
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={ieltsCourseSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ setFieldValue, values, errors, touched, isSubmitting, resetForm }) => (
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden font-sans">
                    <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 flex justify-between items-center">
                        <div className="text-white">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <BookOpen className="w-5 h-5" />
                                Create New Course
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">
                                Fill in the details to add a new IELTS course
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                            disabled={isUploading || isPending || isSubmitting}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <Form className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                        {uploadError && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <strong>Error:</strong> {uploadError}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* IMAGE SECTION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Course Thumbnail <span className="text-red-500">*</span>
                            </label>

                            {imagePreview ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 group">
                                    <img
                                        src={imagePreview}
                                        className="w-full h-full object-cover"
                                        alt="Course thumbnail"
                                    />
                                    {(isUploading || isPending || isSubmitting) && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(setFieldValue)}
                                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 disabled:opacity-50"
                                        disabled={isUploading || isPending || isSubmitting}
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={`relative flex flex-col items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                        dragActive
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30"
                                    } ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={(e) => handleDrop(e, setFieldValue)}
                                    onClick={() => !isUploading && fileInputRef.current?.click()}
                                >
                                    {isUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                            <p className="text-sm text-gray-600">Uploading...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="p-3 bg-blue-100 rounded-full">
                                                <Upload className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PNG, JPG, GIF up to 5MB
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setFieldValue)}
                                disabled={isUploading || isPending || isSubmitting}
                            />
                            
                            {errors.thumbnailid && touched.thumbnailid && !uploadError && (
                                <div className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> 
                                    {errors.thumbnailid}
                                </div>
                            )}
                        </div>

                        {/* TITLE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Course Title <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Field
                                    name="title"
                                    placeholder="e.g., IELTS Academic Masterclass"
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        errors.title && touched.title ? "border-red-500" : "border-gray-300"
                                    }`}
                                    disabled={isUploading || isPending || isSubmitting}
                                />
                            </div>
                            <ErrorMessage name="title" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                            </ErrorMessage>
                        </div>

                        {/* TWO COLUMN LAYOUT */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* IELTS TYPE */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Type <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Field
                                        as="select"
                                        name="ieltsTypeid"
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer bg-white"
                                        disabled={isUploading || isPending || isLoadingTypes || isSubmitting}
                                    >
                                        <option value="" disabled>
                                            {isLoadingTypes ? "Loading types..." : "Select IELTS Type"}
                                        </option>
                                        {ieltsTypesData?.map((type: any) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                                <ErrorMessage name="ieltsTypeid" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                    {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                                </ErrorMessage>
                            </div>

                            {/* STATUS */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Status
                                </label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Field
                                        as="select"
                                        name="isPublished"
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer bg-white"
                                        disabled={isUploading || isPending || isSubmitting}
                                    >
                                        <option value="false">📝 Draft</option>
                                        <option value="true">🚀 Published</option>
                                    </Field>
                                </div>
                            </div>
                        </div>

                        {/* PRICE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Price <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Field
                                    name="price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${
                                        errors.price && touched.price ? "border-red-500" : "border-gray-300"
                                    }`}
                                    disabled={isUploading || isPending || isSubmitting}
                                />
                            </div>
                            <ErrorMessage name="price" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                            </ErrorMessage>
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <Field
                                as="textarea"
                                name="description"
                                rows={4}
                                placeholder="Describe what students will learn in this course..."
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all ${
                                    errors.description && touched.description ? "border-red-500" : "border-gray-300"
                                }`}
                                disabled={isUploading || isPending || isSubmitting}
                            />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                            </ErrorMessage>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    setImagePreview("");
                                    setUploadError("");
                                    onClose();
                                }}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                                disabled={isUploading || isPending || isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isUploading || isPending || isSubmitting || !values.thumbnailid || !values.ieltsTypeid}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {(isPending || isSubmitting) ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : isUploading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Uploading...
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
                </div>
            )}
        </Formik>
    );
}

