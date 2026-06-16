// // PlanManagement.tsx - Updated to match API structure (plan as string)
// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Save, Calendar, DollarSign, CheckCircle } from 'lucide-react';
// import { useAdminStore } from '../../../store/admin.store';

// export default function PlanManagement() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { admins, updatePlan } = useAdminStore();
//   const admin = admins.find(a => a.id === id);

//   const [planType, setPlanType] = useState(admin?.plan || 'basic');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [amount, setAmount] = useState(0);

//   const planPricing = {
//     basic: 49,
//     standard: 99,
//     premium: 199
//   };

//   const planFeatures = {
//     basic: ['Up to 10 Users', 'Basic Analytics', 'Email Support'],
//     standard: ['Up to 50 Users', 'Advanced Analytics', 'Priority Support', 'API Access'],
//     premium: ['Unlimited Users', 'Advanced Analytics', '24/7 Priority Support', 'API Access', 'Custom Integration', 'Dedicated Account Manager']
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (admin) {
//       updatePlan(id!, planType);
//       alert(`Plan updated to ${planType.charAt(0).toUpperCase() + planType.slice(1)} successfully!`);
//       navigate(`/user/${id}`);
//     }
//   };

//   // Calculate end date (1 year from start date)
//   const calculateEndDate = (startDateStr: string) => {
//     if (!startDateStr) return '';
//     const start = new Date(startDateStr);
//     const end = new Date(start);
//     end.setFullYear(end.getFullYear() + 1);
//     return end.toISOString().split('T')[0];
//   };

//   const handleStartDateChange = (date: string) => {
//     setStartDate(date);
//     if (date) {
//       setEndDate(calculateEndDate(date));
//     } else {
//       setEndDate('');
//     }
//   };

//   if (!admin) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-slate-500">Company not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto space-y-6">
//       <button
//         onClick={() => navigate(`/user/${id}`)}
//         className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
//       >
//         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-500" />
//         <span className="text-md font-medium">Back to Company Details</span>
//       </button>

//       <div className="bg-white rounded-xl shadow-md border border-slate-200">
//         <div className="border-b border-slate-200 p-6">
//           <h2 className="text-xl font-semibold text-slate-900">Manage Plan - {admin.companyName}</h2>
//           <p className="text-sm text-slate-500 mt-1">
//             Current Plan: <span className="font-medium text-indigo-600 capitalize">{admin.plan || 'Not assigned'}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="grid grid-cols-1 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-3">Select Plan Type</label>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 {(['basic', 'standard', 'premium'] as const).map((type) => (
//                   <label
//                     key={type}
//                     className={`relative border-2 rounded-lg p-4 cursor-pointer transition-all ${
//                       planType === type
//                         ? 'border-indigo-600 bg-indigo-50 shadow-md'
//                         : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="planType"
//                       value={type}
//                       checked={planType === type}
//                       onChange={(e) => {
//                         setPlanType(e.target.value as any);
//                         setAmount(planPricing[type]);
//                       }}
//                       className="sr-only"
//                     />
//                     <div className="text-center">
//                       <h3 className="font-semibold text-slate-900 capitalize text-lg">{type}</h3>
//                       <p className="text-2xl font-bold text-indigo-600 mt-2">
//                         ${planPricing[type]}
//                         <span className="text-sm text-slate-500 font-normal">/month</span>
//                       </p>
//                       <ul className="mt-4 space-y-2 text-sm text-slate-600">
//                         {planFeatures[type].map((feature, idx) => (
//                           <li key={idx} className="flex items-center justify-center gap-2">
//                             <CheckCircle className="h-3 w-3 text-green-500" />
//                             <span>{feature}</span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   <Calendar className="h-4 w-4 inline mr-2" />
//                   Subscription Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => handleStartDateChange(e.target.value)}
//                   required
//                   min={new Date().toISOString().split('T')[0]}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                 />
//                 <p className="text-xs text-slate-400 mt-1">Subscription will start on this date</p>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-2">
//                   <Calendar className="h-4 w-4 inline mr-2" />
//                   Subscription End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={endDate}
//                   readOnly
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600"
//                 />
//                 <p className="text-xs text-slate-400 mt-1">Auto-calculated (1 year from start)</p>
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 <DollarSign className="h-4 w-4 inline mr-2" />
//                 Total Amount (USD)
//               </label>
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
//                 <input
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(Number(e.target.value))}
//                   required
//                   className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="0.00"
//                 />
//               </div>
//               <p className="text-xs text-slate-400 mt-1">Annual subscription amount</p>
//             </div>
//           </div>

//           {/* Plan Summary */}
//           {startDate && endDate && (
//             <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
//               <h4 className="font-semibold text-slate-900 mb-2">Plan Summary</h4>
//               <div className="space-y-1 text-sm">
//                 <p className="text-slate-600">
//                   <span className="font-medium">Plan:</span> {planType.charAt(0).toUpperCase() + planType.slice(1)}
//                 </p>
//                 <p className="text-slate-600">
//                   <span className="font-medium">Duration:</span> {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-slate-600">
//                   <span className="font-medium">Total Amount:</span> ${amount}
//                 </p>
//                 <p className="text-slate-600">
//                   <span className="font-medium">Monthly Equivalent:</span> ${(amount / 12).toFixed(2)}/month
//                 </p>
//               </div>
//             </div>
//           )}

//           <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
//             <div className="flex items-start gap-3">
//               <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
//               <div>
//                 <p className="text-sm text-blue-800 font-medium">Plan Change Information</p>
//                 <p className="text-xs text-blue-600 mt-1">
//                   Changing the plan will immediately update the company's features and billing. 
//                   The new plan will be active from the selected start date.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={!startDate || !endDate || !amount}
//               className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <Save className="h-4 w-4" />
//               Update Plan to {planType.charAt(0).toUpperCase() + planType.slice(1)}
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
//     </div>
//   );
// }