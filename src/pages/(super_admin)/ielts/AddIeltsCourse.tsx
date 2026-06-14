import { useState, useRef } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { X, Upload, BookOpen, DollarSign, Globe, Layers, AlertCircle, CheckCircle } from "lucide-react";
import { ieltsCourseSchema } from "../../../schema/ieltsSchema";
import { useAppMutation } from "../../../lib/react-query";

export default function AddIeltsCourse({ onClose }: { onClose: () => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [dragActive, setDragActive] = useState(false);

    const { mutate, isPending } = useAppMutation({
        url: "/ielts",
        type: "post",
        onSuccess: () => onClose(),
        onError: (err) => {
            console.error("Create course error:", err);
        },
    });

    const initialValues: any = {
        title: "",
        description: "",
        ieltsType: { id: "Academic" },
        isPublished: false,
        thumbnail: "",
        thumbnailKey: "",
        price: 0,
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setFieldValue: (field: string, value: any) => void
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be under 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            setImagePreview(base64);
            setFieldValue("thumbnail", base64);
            setFieldValue("thumbnailKey", file.name);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (setFieldValue: (field: string, value: any) => void) => {
        setImagePreview("");
        setFieldValue("thumbnail", "");
        setFieldValue("thumbnailKey", "");
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

    const handleDrop = (e: React.DragEvent, setFieldValue: any) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be under 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImagePreview(base64);
                setFieldValue("thumbnail", base64);
                setFieldValue("thumbnailKey", file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={ieltsCourseSchema}
            onSubmit={(values, { resetForm }) => {
                // const payload = {
                //   ...values,
                //   isPublished: Boolean(values.isPublished),
                // };
                const payload = {
                    title: values.title,
                    description: values.description,
                    ieltsType: values.ieltsType.id, 
                    thumbnail: values.thumbnail,
                    thumbnailKey: values.thumbnailKey,
                    isPublished: Boolean(values.isPublished),
                    price: Number(values.price),
                };
                mutate({ data: payload });
                resetForm();
                setImagePreview("");
            }}
        >
            {({ setFieldValue, values, errors, touched }) => (
                <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden font-sans">
                    {/* HEADER */}
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
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <Form className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                        {/* IMAGE SECTION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Course Thumbnail
                            </label>

                            {imagePreview ? (
                                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-50 group">
                                    <img
                                        src={imagePreview}
                                        className="w-full h-full object-cover"
                                        alt="Course thumbnail"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(setFieldValue)}
                                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className={`relative flex flex-col items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${dragActive
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30"
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={(e) => handleDrop(e, setFieldValue)}
                                    onClick={() => fileInputRef.current?.click()}
                                >
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
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setFieldValue)}
                            />
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
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.title && touched.title ? "border-red-500" : "border-gray-300"
                                        }`}
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
                                        name="ieltsType.id"
                                        className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none cursor-pointer bg-white"
                                    >
                                        <option value="Academic">Academic</option>
                                        <option value="GT">General Training (GT)</option>
                                        <option value="UKVI">UKVI</option>
                                    </Field>
                                </div>
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
                                        onChange={(e: any) =>
                                            setFieldValue("isPublished", e.target.value === "true")
                                        }
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
                                    className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${errors.price && touched.price ? "border-red-500" : "border-gray-300"
                                        }`}
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
                                className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none transition-all ${errors.description && touched.description ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            <ErrorMessage name="description" component="div" className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                {(msg) => <><AlertCircle className="w-3 h-3" /> {msg}</>}
                            </ErrorMessage>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
                </div>
            )}
        </Formik>
    );
}