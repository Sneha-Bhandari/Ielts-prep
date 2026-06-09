import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { loginSchema } from "../schema/loginSchema";
import { useLogin } from "../hook/userLogin";
import { useAuthStore } from "../store/auth.store";
import type { LoginValues } from "../interfaces/login";
import { Eye, EyeOff, Loader2 } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const handleSubmit = async (
    values: LoginValues,
    helpers: FormikHelpers<LoginValues>
  ) => {
    try {
      const data = await loginMutation.mutateAsync(values);
      setAuth(data.user, data.token);
      helpers.resetForm();
       if (data.requiresOtp) {
        navigate("/otp", { state: { email: values.email } });
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      helpers.setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-slate-100/70 border border-slate-100">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Please enter your details to sign in
          </p>
        </div>

        <Formik<LoginValues>
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="mt-8 space-y-6">

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="relative">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-slate-50/50 placeholder-slate-400 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none text-slate-800"
                  />
                </div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs font-medium mt-1 pl-1"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium text-slate-700">
                    Password
                  </label>
                  {/* Optional: Add a Forgot Password link here in the future */}
                </div>
                
                <div className="relative">
                  <Field
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 px-4 py-3 rounded-xl bg-slate-50/50 placeholder-slate-400 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none text-slate-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs font-medium mt-1 pl-1"
                />
              </div>

              {/* API ERROR BANNER */}
              {loginMutation.isError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-red-600 text-sm font-medium text-center">
                    {loginMutation.error.message || "Invalid credentials. Please try again."}
                  </p>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  loginMutation.isPending ||
                  !dirty ||
                  !isValid
                }
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-violet-600/10 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
              >
                {loginMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing you in...</span>
                  </>
                ) : (
                  "Sign in"
                )}
              </button>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Login;