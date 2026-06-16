import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MapPin, FileText, Users as UsersIcon, Edit, Trash2, X, CreditCard, Settings, Activity, UserPlus, Building, Globe, Calendar, Loader2 } from 'lucide-react';
import { AddRepresentativeForm } from './components/AddRepresentativeForm';
import { EditRepresentativeModal } from './components/EditRepresentativeModal';
import { useAdminStore } from '../../../store/admin.store';
import { useAppQuery, useAppMutation } from '../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { CompanyRepresentative, Admin } from '../../../interfaces/admin.interface';
import { uploadFile } from '../../../lib/file-upload';
import toast, { Toaster } from 'react-hot-toast';

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { admins } = useAdminStore();
  
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showEditPerson, setShowEditPerson] = useState<CompanyRepresentative | null>(null);
  const [showDeletePerson, setShowDeletePerson] = useState<string | null>(null);
  const [showCompanyDocumentModal, setShowCompanyDocumentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Ensure id is a string before using it
  const companyId = id || '';

  // Fetch admin/company details from API
  const { data: adminData, isLoading: isLoadingAdmin } = useAppQuery<Admin>({
    url: companyId ? `/admins/${companyId}` : '',
    queryKey: ["admin", companyId],
    enabled: !!companyId,
  });

  // Use fetched data or fallback to store data
  const admin = adminData || admins.find(a => a.id === companyId);

  // Fetch representatives for this specific company - use query parameter
  const { data: representatives = [], refetch: refetchRepresentatives, isLoading: isLoadingReps } = useAppQuery<CompanyRepresentative[]>({
    url: companyId ? `/company-representatives` : '',
    queryKey: ["representatives", companyId],
    enabled: !!companyId,
    params: companyId ? { adminId: companyId } : undefined,
  });

  const { mutate: createRepresentative, isPending: isCreating } = useAppMutation({
    url: `/company-representatives`,
    type: "post",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["representatives", companyId] });
      queryClient.invalidateQueries({ queryKey: ["admin", companyId] });
      refetchRepresentatives();
      setShowAddPerson(false);
      toast.success('Representative added successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to add representative');
    },
  });

  const { mutate: updateRepresentativeApi, isPending: isUpdating } = useAppMutation({
    url: `/company-representatives`,
    type: "patch",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["representatives", companyId] });
      queryClient.invalidateQueries({ queryKey: ["admin", companyId] });
      refetchRepresentatives();
      setShowEditPerson(null);
      toast.success('Representative updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update representative');
    },
  });

  const { mutate: deleteRepresentativeApi, isPending: isDeleting } = useAppMutation({
    url: `/company-representatives`,
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["representatives", companyId] });
      queryClient.invalidateQueries({ queryKey: ["admin", companyId] });
      refetchRepresentatives();
      setShowDeletePerson(null);
      toast.success('Representative removed successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete representative');
    },
  });

  const getCompanyLogoUrl = () => {
    if (!admin?.companyLogo?.url) return null;
    return admin.companyLogo.url;
  };

  const getRegistrationDocUrl = () => {
    if (!admin?.registrationDocument?.url) return null;
    return admin.registrationDocument.url;
  };

  const getProofDocUrl = (proofDocumentId: any) => {
    if (!proofDocumentId?.url) return null;
    return proofDocumentId.url;
  };

  const handleAddRepresentative = async (values: any) => {
    setIsLoading(true);
    try {
      let proofDocumentId = null;
      
      if (values.proofDocumentFile instanceof File) {
        const uploadedFile = await uploadFile(values.proofDocumentFile);
        proofDocumentId = { id: uploadedFile.id, url: uploadedFile.url };
      }
      
      const payload = {
        admin: { id: admin?.id },
        name: values.name,
        email: values.email,
        contact: values.contact,
        designation: values.designation,
        proofDocumentId: proofDocumentId,
      };
      
      createRepresentative({ data: payload });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to add representative');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditRepresentative = async (values: any) => {
    if (!showEditPerson) return;
    
    setIsLoading(true);
    try {
      let proofDocumentId = showEditPerson.proofDocumentId;
      
      if (values.proofDocumentFile instanceof File) {
        const uploadedFile = await uploadFile(values.proofDocumentFile);
        proofDocumentId = { id: uploadedFile.id, url: uploadedFile.url };
      } 
      else if (values.removeProofDocument) {
        proofDocumentId = null;
      }
      
      const payload = {
        admin: { id: admin?.id },
        name: values.name,
        email: values.email,
        contact: values.contact,
        designation: values.designation,
        proofDocumentId: proofDocumentId,
      };
      
      updateRepresentativeApi({ id: showEditPerson.id, data: payload });
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update representative');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRepresentative = () => {
    if (showDeletePerson) {
      deleteRepresentativeApi({ id: showDeletePerson });
    }
  };

  if (isLoadingAdmin || !admin) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-slate-500">Loading company details...</span>
      </div>
    );
  }

  const logoUrl = getCompanyLogoUrl();
  const registrationDocUrl = getRegistrationDocUrl();

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <button
        onClick={() => navigate('/user')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-500" />
        <span className="text-md font-medium cursor-pointer">Back to Company Management</span>
      </button>

      {/* Company Header */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {logoUrl && !logoError ? (
                <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-lg">
                  <img 
                    src={logoUrl}
                    alt={admin.companyName}
                    className="h-full w-full object-cover rounded-lg"
                    onError={() => setLogoError(true)}
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20">
                  <Building className="h-10 w-10 text-white" />
                </div>
              )}
              
              <div>
                <h2 className="text-2xl font-bold text-white">{admin.companyName}</h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <p className="text-indigo-100 text-sm">Country: {admin.country}</p>
                  <span className="text-indigo-300">•</span>
                  <p className="text-indigo-100 text-sm">PAN: {admin.panNo}</p>
                  {admin.website && (
                    <>
                      <span className="text-indigo-300">•</span>
                      <a href={admin.website} target="_blank" rel="noopener noreferrer" className="text-indigo-100 text-sm hover:text-white">
                        Website
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/user/${companyId}/plan`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer text-sm flex items-center gap-1 transition-all backdrop-blur-sm"
              >
                <Settings className="h-4 w-4" />
                Plan
              </button>
              <button
                onClick={() => navigate(`/user/${companyId}/payment`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer text-sm flex items-center gap-1 transition-all backdrop-blur-sm"
              >
                <CreditCard className="h-4 w-4" />
                Payment
              </button>
              <button
                onClick={() => navigate(`/user/${companyId}/status`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer text-sm flex items-center gap-1 transition-all backdrop-blur-sm"
              >
                <Activity className="h-4 w-4" />
                Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4 text-indigo-600" />
            Company Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
              <span className="text-slate-600">{admin.email}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
              <span className="text-slate-600">{admin.companyAddress}</span>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-slate-400 mt-0.5" />
              <span className="text-slate-600">Country: {admin.country}</span>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
              <span className="text-slate-600">Plan: {admin?.plan?.name || 'Not assigned'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" />
            Registration Document
          </h3>
          {admin.registrationDocument?.url ? (
            <div className="space-y-2">
              <button
                onClick={() => setShowCompanyDocumentModal(true)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded flex items-center gap-2 transition-colors"
              >
                <FileText className="h-3 w-3" />
                View Registration Document
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No registration document uploaded</p>
          )}
        </div>
      </div>

      {/* Status Badge & Payment Status */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Account Status:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            admin.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {admin.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Payment Status:</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            admin.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' :
            admin.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {admin.paymentStatus?.charAt(0).toUpperCase() + admin.paymentStatus?.slice(1) || 'Pending'}
          </span>
        </div>
      </div>

      {/* Representatives Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-900">Company Representatives</h3>
              <p className="text-sm text-slate-500 mt-1">Contact persons for this company</p>
            </div>
            <button
              onClick={() => setShowAddPerson(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <UserPlus className="h-4 w-4" />
              Add Representative
            </button>
          </div>
        </div>

        {isLoadingReps ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-slate-500 mt-2">Loading representatives...</p>
          </div>
        ) : representatives.length === 0 ? (
          <div className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No representatives added yet</p>
            <p className="text-sm text-slate-400 mt-1">Add contact persons for this company</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {representatives.map((rep) => {
              const proofDocUrl = getProofDocUrl(rep.proofDocumentId);
              return (
                <div key={rep.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h4 className="font-medium text-slate-900 text-lg">{rep.name}</h4>
                        <p className="text-sm text-slate-500">{rep.designation}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{rep.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{rep.contact}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">
                            Proof Document: {rep.proofDocumentId ? 'Uploaded' : 'Not uploaded'}
                          </span>
                        </div>
                      </div>
                      
                      {proofDocUrl && (
                        <div className="mt-3">
                          <a
                            href={proofDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-indigo-600 px-3 py-2 rounded items-center gap-2 inline-flex transition-colors"
                          >
                            <FileText className="h-3 w-3" />
                            View Proof Document
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowEditPerson(rep)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => setShowDeletePerson(rep.id!)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Representative Modal */}
      {showAddPerson && (
        <AddRepresentativeForm
          onSubmit={handleAddRepresentative}
          isLoading={isLoading || isCreating}
          onClose={() => setShowAddPerson(false)}
        />
      )}

      {/* Edit Representative Modal */}
      {showEditPerson && (
        <EditRepresentativeModal
          representative={showEditPerson}
          onSubmit={handleEditRepresentative}
          isLoading={isLoading || isUpdating}
          onClose={() => setShowEditPerson(null)}
        />
      )}

      {/* Delete Representative Confirmation Modal */}
      {showDeletePerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-center text-slate-900 mb-2">Remove Representative</h3>
              <p className="text-sm text-center text-slate-500 mb-6">
                Are you sure you want to remove this representative? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeletePerson(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRepresentative}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Registration Document Modal */}
      {showCompanyDocumentModal && registrationDocUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Registration Document Preview</h3>
              </div>
              <button onClick={() => setShowCompanyDocumentModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              {registrationDocUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img 
                  src={registrationDocUrl} 
                  alt="Registration Document"
                  className="w-full rounded-lg"
                />
              ) : (
                <iframe 
                  src={registrationDocUrl}
                  className="w-full h-[70vh] rounded-lg"
                  title="Registration Document Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}