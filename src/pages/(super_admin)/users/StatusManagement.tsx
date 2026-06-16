// // StatusManagement.tsx - Updated to use isActive boolean
// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Save, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
// import { useAdminStore } from '../../../store/admin.store';

// export default function StatusManagement() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { admins, updateStatus } = useAdminStore();
//   const admin = admins.find(a => a.id === id);

//   const [isActive, setIsActive] = useState(admin?.isActive ?? true);
//   const [reason, setReason] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (admin) {
//       updateStatus(id!, isActive);
//       alert(`Company status updated to ${isActive ? 'Active' : 'Inactive'} successfully!`);
//       navigate(`/user/${id}`);
//     }
//   };

//   const statusOptions = [
//     { value: true, label: 'Active', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', description: 'Company has full access to all features' },
//     { value: false, label: 'Inactive', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', description: 'Company cannot access the platform' }
//   ];

//   if (!admin) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-slate-500">Company not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto space-y-6">
//       <button
//         onClick={() => navigate(`/user/${id}`)}
//         className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
//       >
//         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-500" />
//         <span className="text-md font-medium">Back to Company Details</span>
//       </button>

//       <div className="bg-white rounded-xl shadow-md border border-slate-200">
//         <div className="border-b border-slate-200 p-6">
//           <h2 className="text-xl font-semibold text-slate-900">Update Company Status</h2>
//           <p className="text-sm text-slate-500 mt-1">
//             Manage account status for <span className="font-medium text-slate-700">{admin.companyName}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="space-y-4">
//             <label className="block text-sm font-medium text-slate-700 mb-3">
//               Current Status: 
//               <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                 admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//               }`}>
//                 {admin.isActive ? 'Active' : 'Inactive'}
//               </span>
//             </label>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {statusOptions.map((option) => {
//                 const Icon = option.icon;
//                 const isSelected = isActive === option.value;
//                 return (
//                   <label
//                     key={option.label}
//                     className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                       isSelected
//                         ? `${option.bgColor} border-${option.color.split('-')[1]}-600`
//                         : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="status"
//                       value={String(option.value)}
//                       checked={isSelected}
//                       onChange={() => setIsActive(option.value)}
//                       className="sr-only"
//                     />
//                     <div className="text-center">
//                       <Icon className={`h-10 w-10 mx-auto mb-3 ${option.color}`} />
//                       <h3 className="font-semibold text-slate-900 text-lg">{option.label}</h3>
//                       <p className="text-xs text-slate-500 mt-2">{option.description}</p>
//                     </div>
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           {!isActive && (
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 Reason for Deactivation *
//               </label>
//               <textarea
//                 value={reason}
//                 onChange={(e) => setReason(e.target.value)}
//                 rows={3}
//                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 placeholder="Please provide reason for deactivating this company account..."
//                 required
//               />
//               <p className="text-xs text-slate-400 mt-1">
//                 This reason will be logged and notified to the company admin
//               </p>
//             </div>
//           )}

//           <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-sm text-blue-800 font-medium">Important Note</p>
//                 <p className="text-xs text-blue-600 mt-1">
//                   {isActive 
//                     ? "Activating this company will restore full access to all platform features immediately."
//                     : "Deactivating this company will immediately revoke all access to the platform. All associated user accounts will be suspended until reactivation."
//                   }
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={!isActive && !reason}
//               className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Save className="h-4 w-4" />
//               Update Status to {isActive ? 'Active' : 'Inactive'}
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate(`/user/${id}`)}
//               className="flex-1 border border-slate-300 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-50 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Current Status Info Card */}
//       <div className={`rounded-lg p-4 border ${
//         admin.isActive 
//           ? 'bg-green-50 border-green-200' 
//           : 'bg-red-50 border-red-200'
//       }`}>
//         <div className="flex items-start gap-3">
//           {admin.isActive ? (
//             <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
//           ) : (
//             <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
//           )}
//           <div>
//             <p className={`text-sm font-medium ${
//               admin.isActive ? 'text-green-800' : 'text-red-800'
//             }`}>
//               Current Status: {admin.isActive ? 'Active' : 'Inactive'}
//             </p>
//             <p className={`text-xs mt-1 ${
//               admin.isActive ? 'text-green-600' : 'text-red-600'
//             }`}>
//               {admin.isActive 
//                 ? "This company has full access to all platform features and services."
//                 : "This company currently cannot access the platform. Update status to Active to restore access."
//               }
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }