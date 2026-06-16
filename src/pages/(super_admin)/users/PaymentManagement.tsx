// // PaymentManagement.tsx
// import { useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Save, CreditCard, Calendar, DollarSign, AlertCircle } from 'lucide-react';
// import { useAdminStore } from '../../../store/admin.store';
// import { useAppMutation } from '../../../lib/react-query';
// import { useQueryClient } from '@tanstack/react-query';

// export default function PaymentManagement() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { admins, updatePayment } = useAdminStore();
//   const admin = admins.find(a => a.id === id);

//   const [amount, setAmount] = useState<number>(0);
//   const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>(admin?.paymentStatus || 'pending');
//   const [transactionId, setTransactionId] = useState('');
//   const [paymentDate, setPaymentDate] = useState('');
//   const [paymentMethod, setPaymentMethod] = useState('Credit Card');
//   const [notes, setNotes] = useState('');

//   // Update payment mutation
//   const { mutate: updatePaymentApi, isPending } = useAppMutation({
//     url: `/admins/${id}`,
//     type: "patch",
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["admins"] });
//     },
//   });

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (admin) {
//       const payload = {
//         paymentStatus: paymentStatus,
//       };
      
//       updatePaymentApi({ data: payload });
//       updatePayment(id!, paymentStatus);
      
//       alert(`Payment status updated to ${paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)} successfully!`);
//       navigate(`/user/${id}`);
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'completed': return 'text-green-600 bg-green-50 border-green-200';
//       case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//       case 'failed': return 'text-red-600 bg-red-50 border-red-200';
//       default: return 'text-slate-600 bg-slate-50 border-slate-200';
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
//     <div className="max-w-2xl mx-auto space-y-6">
//       <button
//         onClick={() => navigate(`/user/${id}`)}
//         className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
//       >
//         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-500" />
//         <span className="text-md font-medium">Back to Company Details</span>
//       </button>

//       <div className={`rounded-lg p-4 border ${getStatusColor(admin.paymentStatus)}`}>
//         <div className="flex items-start gap-3">
//           <CreditCard className="h-5 w-5 mt-0.5 shrink-0" />
//           <div>
//             <p className="text-sm font-medium">
//               Current Payment Status: {admin.paymentStatus.charAt(0).toUpperCase() + admin.paymentStatus.slice(1)}
//             </p>
//             <p className="text-xs mt-1 opacity-75">
//               {admin.paymentStatus === 'completed' 
//                 ? "Payment has been completed. The company has full access to the platform."
//                 : admin.paymentStatus === 'pending'
//                 ? "Payment is pending. The company's access may be limited until payment is confirmed."
//                 : "Payment has failed. Please update payment details to restore access."}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-md border border-slate-200">
//         <div className="border-b border-slate-200 p-6">
//           <div className="flex items-center gap-2">
//             <CreditCard className="h-6 w-6 text-indigo-600" />
//             <h2 className="text-xl font-semibold text-slate-900">Payment Management</h2>
//           </div>
//           <p className="text-sm text-slate-500 mt-1">
//             Update payment status for <span className="font-medium text-slate-700">{admin.companyName}</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="grid grid-cols-1 gap-6">
//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 <DollarSign className="h-4 w-4 inline mr-2" />
//                 Amount (USD)
//               </label>
//               <input
//                 type="number"
//                 value={amount}
//                 onChange={(e) => setAmount(Number(e.target.value))}
//                 required
//                 placeholder="0.00"
//                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <p className="text-xs text-slate-400 mt-1">Enter the payment amount</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Payment Status</label>
//               <select
//                 value={paymentStatus}
//                 onChange={(e) => setPaymentStatus(e.target.value as any)}
//                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="pending">Pending</option>
//                 <option value="completed">Completed</option>
//                 <option value="failed">Failed</option>
//               </select>
//               <p className="text-xs text-slate-400 mt-1">
//                 {paymentStatus === 'completed' 
//                   ? "Mark as completed when payment is successfully received"
//                   : paymentStatus === 'pending'
//                   ? "Mark as pending while waiting for payment confirmation"
//                   : "Mark as failed if payment was unsuccessful"}
//               </p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Transaction ID</label>
//               <input
//                 type="text"
//                 value={transactionId}
//                 onChange={(e) => setTransactionId(e.target.value)}
//                 required
//                 placeholder="TXN-XXXX-XXXX"
//                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <p className="text-xs text-slate-400 mt-1">Unique transaction identifier from payment gateway</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">
//                 <Calendar className="h-4 w-4 inline mr-2" />
//                 Payment Date
//               </label>
//               <input
//                 type="date"
//                 value={paymentDate}
//                 onChange={(e) => setPaymentDate(e.target.value)}
//                 required
//                 max={new Date().toISOString().split('T')[0]}
//                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//               <p className="text-xs text-slate-400 mt-1">Date when the payment was processed</p>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Payment Method</label>
//               <select
//                 value={paymentMethod}
//                 onChange={(e) => setPaymentMethod(e.target.value)}
//                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               >
//                 <option value="Credit Card">Credit Card</option>
//                 <option value="Debit Card">Debit Card</option>
//                 <option value="Bank Transfer">Bank Transfer</option>
//                 <option value="PayPal">PayPal</option>
//                 <option value="Cryptocurrency">Cryptocurrency</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Check">Check</option>
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-slate-700 mb-2">Payment Notes (Optional)</label>
//               <textarea
//                 value={notes}
//                 onChange={(e) => setNotes(e.target.value)}
//                 rows={3}
//                 placeholder="Add any additional notes about this payment..."
//                 className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               />
//             </div>
//           </div>

//           {/* Payment Summary */}
//           {amount > 0 && paymentDate && (
//             <div className="bg-linear-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100">
//               <h4 className="font-semibold text-slate-900 mb-2">Payment Summary</h4>
//               <div className="space-y-1 text-sm">
//                 <p className="text-slate-600">
//                   <span className="font-medium">Company:</span> {admin.companyName}
//                 </p>
//                 <p className="text-slate-600">
//                   <span className="font-medium">Amount:</span> ${amount.toLocaleString()}
//                 </p>
//                 <p className="text-slate-600">
//                   <span className="font-medium">Status:</span> {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
//                 </p>
//                 <p className="text-slate-600">
//                   <span className="font-medium">Date:</span> {new Date(paymentDate).toLocaleDateString()}
//                 </p>
//                 <p className="text-slate-600">
//                   <span className="font-medium">Method:</span> {paymentMethod}
//                 </p>
//                 {transactionId && (
//                   <p className="text-slate-600">
//                     <span className="font-medium">Transaction ID:</span> {transactionId}
//                   </p>
//                 )}
//               </div>
//             </div>
//           )}

//           <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
//             <div className="flex items-start gap-3">
//               <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
//               <div>
//                 <p className="text-sm text-blue-800 font-medium">Payment Information</p>
//                 <p className="text-xs text-blue-600 mt-1">
//                   Updating the payment status will affect the company's access to the platform. 
//                   Only mark as "Completed" when payment is fully confirmed.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={!amount || !transactionId || !paymentDate || isPending}
//               className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isPending ? (
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//               ) : (
//                 <Save className="h-4 w-4" />
//               )}
//               Update Payment Status to {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
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