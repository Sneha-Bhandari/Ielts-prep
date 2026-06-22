import { Formik, Form, Field } from "formik";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useAppQuery, useAppMutation } from "../../../lib/react-query";
import * as Yup from "yup";

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  ieltsTypeId: Yup.string().required("IELTS Type is required"),
});

const CreateMockTest = () => {
  const navigate = useNavigate();

  // Fetch IELTS types
  const { data: ieltsTypesData, isLoading: isLoadingTypes } = useAppQuery<any[]>({
    url: "/ielts-types/",
    queryKey: ["ieltsTypes"],
  });

  // Create mock test mutation
  const { mutate, isPending } = useAppMutation({
    url: "/mock-tests/",
    type: "post",
    onSuccess: (data) => {
      // Navigate to module selection with the created test ID
      if (data?.id) {
        console.log("Mock test created with ID:", data.id);
        navigate(`/mock-tests/${data.id}/modules`);
      } else {
        console.error("No ID returned from server", data);
      }
    },
    onError: (error: any) => {
      console.error("Failed to create mock test:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to create test";
      alert(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    },
  });

  return (
    <div className="max-w-xl mx-auto p-6 md:p-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 mb-6 transition-colors group"
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Dashboard
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Create Mock Test
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Set up a new IELTS practice examination. You can add specific modules and sections in the next step.
          </p>
        </div>

        <Formik
          initialValues={{
            title: "",
            ieltsTypeId: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            // Prepare payload matching API expectations
            const payload = {
              title: values.title,
              Type: values.ieltsTypeId, // Map ieltsTypeId to Type as per API spec
            };
            
            console.log("Submitting payload:", payload);
            
            mutate({
              data: payload
            }, {
              onSettled: () => {
                setSubmitting(false);
              }
            });
          }}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="space-y-5">
              {/* Title Field */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Test Title <span className="text-red-500">*</span>
                </label>
                <Field
                  id="title"
                  name="title"
                  placeholder="e.g., Cambridge IELTS 18 - Test 1"
                  className={`w-full border ${errors.title && touched.title ? 'border-red-500' : 'border-slate-200'} rounded-lg px-3.5 py-2.5 text-sm bg-white placeholder:text-slate-400 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all`}
                />
                {errors.title && touched.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              {/* IELTS Type Field */}
              <div className="space-y-1.5">
                <label htmlFor="ieltsTypeId" className="text-sm font-medium text-slate-700">
                  IELTS Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Field
                    as="select"
                    id="ieltsTypeId"
                    name="ieltsTypeId"
                    className={`w-full border ${errors.ieltsTypeId && touched.ieltsTypeId ? 'border-red-500' : 'border-slate-200'} rounded-lg px-3.5 py-2.5 text-sm bg-white text-slate-900 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all appearance-none pr-10`}
                    disabled={isLoadingTypes || isSubmitting || isPending}
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
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
                {errors.ieltsTypeId && touched.ieltsTypeId && (
                  <p className="text-xs text-red-500 mt-1">{errors.ieltsTypeId}</p>
                )}
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
                  disabled={isSubmitting || isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isPending || isLoadingTypes}
                  className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-purple-100 flex items-center gap-2"
                >
                  {(isSubmitting || isPending) ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Creating...
                    </>
                  ) : (
                    "Next: Configure Modules"
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateMockTest;