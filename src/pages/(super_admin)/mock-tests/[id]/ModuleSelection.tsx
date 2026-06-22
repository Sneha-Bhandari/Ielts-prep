// import {
//   Headphones,
//   BookOpen,
//   Pencil,
//   Mic,
//   ArrowLeft,
//   ArrowRight,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const modules = [
//   {
//     name: "Listening",
//     icon: Headphones,
//     description: "4 sections, 40 questions. Test audio processing and retention.",
//     color: "text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300 ring-blue-500/10",
//   },
//   {
//     name: "Reading",
//     icon: BookOpen,
//     description: "3 passages, 40 questions. Test academic reading comprehension.",
//     color: "text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300 ring-emerald-500/10",
//   },
//   {
//     name: "Writing",
//     icon: Pencil,
//     description: "2 tasks. Test analytical report writing and essay structuring.",
//     color: "text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300 ring-amber-500/10",
//   },
//   {
//     name: "Speaking",
//     icon: Mic,
//     description: "3 parts. Test face-to-face verbal fluency and expression.",
//     color: "text-purple-600 bg-purple-50 border-purple-100 hover:border-purple-300 ring-purple-500/10",
//   },
// ];

// const ModuleSelection = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
//       {/* Back Button & Navigation context */}
//       <button
//         onClick={() => navigate(-1)}
//         className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors group"
//       >
//         <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
//         Back to Test Configuration
//       </button>

//       {/* Header Section */}
//       <div className="border-b border-slate-100 pb-5">
//         <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
//           Select Module
//         </h1>
//         <p className="text-sm text-slate-500 mt-1">
//           Choose a module configuration to build, update, or preview its specific test parameters.
//         </p>
//       </div>

//       {/* Grid Grid Layout */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
//         {modules.map((module) => {
//           const Icon = module.icon;

//           return (
//             <div
//               key={module.name}
//               onClick={() => navigate(`/mock-tests/1/${module.name.toLowerCase()}`)}
//               className="group cursor-pointer border border-slate-200 rounded-2xl p-6 bg-white hover:bg-slate-50/50 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between relative focus-within:ring-4 focus-within:ring-purple-500/10"
//             >
//               <div>
//                 {/* Icon Container with specific module color configuration */}
//                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 border ${module.color.split(' ').slice(0, 3).join(' ')}`}>
//                   <Icon size={22} />
//                 </div>

//                 <h2 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
//                   {module.name}
//                 </h2>
                
//                 <p className="text-sm text-slate-500 mt-1.5 leading-relaxed pr-6">
//                   {module.description}
//                 </p>
//               </div>

//               {/* Action Indicator */}
//               <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
//                 <span>Configure</span>
//                 <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-200" />
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ModuleSelection;

import {
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  ArrowLeft,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppQuery } from "../../../../lib/react-query";
// import { useAppQuery } from "../../../lib/react-query";

// Map icon names to components
const iconMap: Record<string, any> = {
  Listening: Headphones,
  Reading: BookOpen,
  Writing: Pencil,
  Speaking: Mic,
};

// Color mapping for different module types
const colorMap: Record<string, string> = {
  Listening: "text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300 ring-blue-500/10",
  Reading: "text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300 ring-emerald-500/10",
  Writing: "text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300 ring-amber-500/10",
  Speaking: "text-purple-600 bg-purple-50 border-purple-100 hover:border-purple-300 ring-purple-500/10",
};

// Default descriptions for each module type
const defaultDescriptions: Record<string, string> = {
  Listening: "4 sections, 40 questions. Test audio processing and retention.",
  Reading: "3 passages, 40 questions. Test academic reading comprehension.",
  Writing: "2 tasks. Test analytical report writing and essay structuring.",
  Speaking: "3 parts. Test face-to-face verbal fluency and expression.",
};

const ModuleSelection = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  console.log("Module ID from URL:", id);

  // Fetch module types from API
  const { data: moduleTypesData, isLoading, error } = useAppQuery<any[]>({
    url: "/moduletypes",
    queryKey: ["moduleTypes"],
  });

  // Process module data
  const modules = moduleTypesData && moduleTypesData.length > 0
    ? moduleTypesData.map((type: any) => ({
        id: type.id,
        name: type.name,
        icon: iconMap[type.name] || BookOpen,
        description: defaultDescriptions[type.name] || "Configure this module",
        color: colorMap[type.name] || "text-gray-600 bg-gray-50 border-gray-100 hover:border-gray-300 ring-gray-500/10",
      }))
    : [
        // Fallback modules
        {
          id: "1",
          name: "Listening",
          icon: Headphones,
          description: "4 sections, 40 questions. Test audio processing and retention.",
          color: "text-blue-600 bg-blue-50 border-blue-100 hover:border-blue-300 ring-blue-500/10",
        },
        {
          id: "2",
          name: "Reading",
          icon: BookOpen,
          description: "3 passages, 40 questions. Test academic reading comprehension.",
          color: "text-emerald-600 bg-emerald-50 border-emerald-100 hover:border-emerald-300 ring-emerald-500/10",
        },
        {
          id: "3",
          name: "Writing",
          icon: Pencil,
          description: "2 tasks. Test analytical report writing and essay structuring.",
          color: "text-amber-600 bg-amber-50 border-amber-100 hover:border-amber-300 ring-amber-500/10",
        },
        {
          id: "4",
          name: "Speaking",
          icon: Mic,
          description: "3 parts. Test face-to-face verbal fluency and expression.",
          color: "text-purple-600 bg-purple-50 border-purple-100 hover:border-purple-300 ring-purple-500/10",
        },
      ];

  // Handle navigation to module
  const handleModuleClick = (moduleName: string) => {
    if (id) {
      // Navigate to the module configuration page
      // Using the correct route pattern
      const path = `/mock-tests/${id}/modules/${moduleName.toLowerCase()}`;
      console.log("Navigating to:", path);
      navigate(path);
    } else {
      console.error("Test ID is undefined - cannot navigate");
      navigate("/mock-tests");
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors group mb-6"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
          Back to Test Configuration
        </button>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-red-700">Failed to load modules</h3>
          <p className="text-sm text-red-600 mt-1">
            {error instanceof Error ? error.message : "Unable to fetch module types. Please try again."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors group mb-6"
        >
          <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
          Back to Test Configuration
        </button>
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          <p className="text-sm text-slate-500 mt-3">Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6">
      {/* Debug: Show test ID */}
      <div className="text-xs text-gray-400">Test ID: {id || "Not found"}</div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors group"
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-0.5 transition-transform" />
        Back to Test Configuration
      </button>

      {/* Header Section */}
      <div className="border-b border-slate-100 pb-5">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Select Module
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Choose a module configuration to build, update, or preview its specific test parameters.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <div
              key={module.id || module.name}
              onClick={() => handleModuleClick(module.name)}
              className="group cursor-pointer border border-slate-200 rounded-2xl p-6 bg-white hover:bg-slate-50/50 hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between relative focus-within:ring-4 focus-within:ring-purple-500/10"
            >
              <div>
                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105 border ${module.color.split(' ').slice(0, 3).join(' ')}`}>
                  <Icon size={22} />
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                  {module.name}
                </h2>
                
                <p className="text-sm text-slate-500 mt-1.5 leading-relaxed pr-6">
                  {module.description}
                </p>
              </div>

              {/* Action Indicator */}
              <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
                <span>Configure</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleSelection;