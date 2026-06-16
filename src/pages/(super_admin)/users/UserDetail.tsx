import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Mail, Phone, MapPin, FileText, Users as UsersIcon, Edit, Trash2, X, CreditCard, Activity, UserPlus, Building, Globe, Loader2,
} from "lucide-react";
import { AddRepresentativeForm } from "./components/AddRepresentativeForm";
import { EditRepresentativeModal } from "./components/EditRepresentativeModal";
import { useAdminStore } from "../../../store/admin.store";
import { useAppQuery, useAppMutation } from "../../../lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import type {
  CompanyRepresentative,
  Admin,
} from "../../../interfaces/admin.interface";
import { getFileUrl } from "../../../lib/file-upload";
import toast, { Toaster } from "react-hot-toast";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { admins } = useAdminStore();

  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showEditPerson, setShowEditPerson] =
    useState<CompanyRepresentative | null>(null);
  const [showDeletePerson, setShowDeletePerson] = useState<string | null>(null);
  const [showCompanyDocumentModal, setShowCompanyDocumentModal] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const companyId = id || "";

  // Fetch single admin by ID
  const { data: adminData, isLoading: isLoadingAdmin } = useAppQuery<Admin>({
    url: companyId ? `/admins/${companyId}` : "",
    queryKey: ["admin", companyId],
    enabled: !!companyId,
  });

  const admin = adminData || admins.find((a) => a.id === companyId);

  // Fetch representatives
  const {
    data: representativesData,
    refetch: refetchRepresentatives,
    isLoading: isLoadingReps,
  } = useAppQuery<CompanyRepresentative[]>({
    url: companyId ? `/company-representatives/admin/${companyId}` : "",
    queryKey: ["representatives", companyId],
    enabled: !!companyId,
  });

  // Format data into array structure dynamically regardless of format type returned
  const representatives = (() => {
    if (!representativesData) return [];
    if (Array.isArray(representativesData)) return representativesData;
    if (
      (representativesData as any).data &&
      Array.isArray((representativesData as any).data)
    ) {
      return (representativesData as any).data;
    }
    if (
      typeof representativesData === "object" &&
      (representativesData as any).id
    ) {
      return [representativesData];
    }
    return [];
  })();

  const { mutate: createRepresentative, isPending: isCreating } =
    useAppMutation({
      url: `/company-representatives`,
      type: "post",
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["representatives", companyId],
        });
        queryClient.invalidateQueries({ queryKey: ["admin", companyId] });
        refetchRepresentatives();
        setShowAddPerson(false);
        toast.success("Representative added successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to add representative"
        );
      },
    });

  const { mutate: updateRepresentativeApi, isPending: isUpdating } =
    useAppMutation({
      url: `/company-representatives`,
      type: "patch",
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["representatives", companyId],
        });
        queryClient.invalidateQueries({ queryKey: ["admin", companyId] });
        refetchRepresentatives();
        setShowEditPerson(null);
        toast.success("Representative updated successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update representative"
        );
      },
    });

  const { mutate: deleteRepresentativeApi, isPending: isDeleting } =
    useAppMutation({
      url: `/company-representatives`,
      type: "delete",
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["representatives", companyId],
        });
        queryClient.invalidateQueries({ queryKey: ["admin", companyId] });
        refetchRepresentatives();
        setShowDeletePerson(null);
        toast.success("Representative removed successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete representative"
        );
      },
    });

  const getCompanyLogoUrl = () => {
    return admin?.companyLogoId?.url || null;
  };

  const getRegistrationDocUrl = () => {
    return admin?.registrationDocumentId?.url || null;
  };

  // const getProofDocUrl = (proofDocumentId: string | null) => {
  //   if (!proofDocumentId) return null;
  //   return getFileUrl(proofDocumentId);
  // };

  const handleAddRepresentative = async (values: any) => {
    if (!admin?.id) {
      toast.error("Admin ID is missing. Please refresh.");
      return;
    }

    setIsLoading(true);
    try {
      let proofDocumentId = null;
      if (values.proofDocumentFile) {
        proofDocumentId = values.proofDocumentFile.id;
      }

      const payload = {
        admin: admin.id,
        name: values.name,
        email: values.email,
        contact: values.contact,
        designation: values.designation,
        proofDocumentId: proofDocumentId,
      };

      createRepresentative({ data: payload });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add representative");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRepresentative = async (values: any) => {
    if (!showEditPerson || !admin?.id) return;

    setIsLoading(true);
    try {
      let proofDocumentId = showEditPerson.proofDocumentId;

      if (values.proofDocumentFile) {
        proofDocumentId = values.proofDocumentFile.id;
      }

      const payload = {
        admin: admin.id,
        name: values.name,
        email: values.email,
        contact: values.contact,
        designation: values.designation,
        proofDocumentId: proofDocumentId,
      };

      updateRepresentativeApi({ id: showEditPerson.id, data: payload });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update representative");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRepresentative = () => {
    if (showDeletePerson) {
      deleteRepresentativeApi({ id: showDeletePerson });
    }
  };

  if (isLoadingAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-slate-500">Loading company details...</span>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Building className="h-12 w-12 text-slate-300 mb-3" />
        <p className="text-slate-500">Company not found</p>
        <button
          onClick={() => navigate("/user")}
          className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-800"
        >
          Go back to company list
        </button>
      </div>
    );
  }

  const logoUrl = getCompanyLogoUrl();
  const registrationDocUrl = getRegistrationDocUrl();

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <button
        onClick={() => navigate("/user")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-500" />
        <span className="text-md font-medium cursor-pointer">
          Back to Company Management
        </span>
      </button>

      {/* Company Header */}
      <div className="bg-linear-to-r from-indigo-600 to-indigo-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Company Header - Update the logo section */}
              {logoUrl && !logoError ? (
                <div className="h-20 w-20 rounded-xl bg-white p-1 shadow-lg shrink-0">
                  <img
                    src={logoUrl}
                    alt={admin.companyName}
                    className="h-full w-full object-contain rounded-lg"
                    onError={(e) => {
                      console.error("Logo failed to load:", logoUrl);
                      setLogoError(true);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 shrink-0">
                  {/* Show company initials on the placeholder */}
                  <span className="text-white font-bold text-xl">
                    {admin?.companyName
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "C"}
                  </span>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-white">
                  {admin.companyName}
                </h2>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <p className="text-indigo-100 text-sm">
                    Country: {admin.country}
                  </p>
                  <span className="text-indigo-300">•</span>
                  <p className="text-indigo-100 text-sm">PAN: {admin.panNo}</p>
                  {admin.website && (
                    <>
                      <span className="text-indigo-300">•</span>
                      <a
                        href={admin.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-100 text-sm hover:text-white"
                      >
                        Website
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/user/${companyId}/payment`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer text-sm flex items-center gap-1 transition-all backdrop-blur-sm"
              >
                <CreditCard className="h-4 w-4" /> Payment
              </button>
              <button
                onClick={() => navigate(`/user/${companyId}/status`)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white cursor-pointer text-sm flex items-center gap-1 transition-all backdrop-blur-sm"
              >
                <Activity className="h-4 w-4" /> Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Building className="h-4 w-4 text-indigo-600" /> Company Information
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
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-600" /> Registration
            Document
          </h3>
          {registrationDocUrl ? (
            <button
              onClick={() => setShowCompanyDocumentModal(true)}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded flex items-center gap-2 transition-colors"
            >
              <FileText className="h-3 w-3" /> View Registration Document
            </button>
          ) : (
            <p className="text-sm text-slate-400 italic">
              No registration document uploaded
            </p>
          )}
        </div>
      </div>

      {/* Representatives Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-slate-900">
                Company Representatives
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Contact persons for this company
              </p>
            </div>
            {/* <button
              onClick={() => setShowAddPerson(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
            >
              <UserPlus className="h-4 w-4" /> Add Representative
            </button> */}
          </div>
        </div>

        {isLoadingReps ? (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
            <p className="text-slate-500 mt-2">Loading representatives...</p>
          </div>
        ) : representatives.length === 0 ? (
          <div className="text-center py-12 w-full">
            <UsersIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No representatives added yet</p>
            <button
              onClick={() => setShowAddPerson(true)}
              className="flex items-center  w-full justify-center cursor-pointer text-center gap-2 px-4 py-2  text-brand rounded-lg  transition-colors text-sm"
            >
              <UserPlus className="h-4 w-4" /> Add Representative
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {/* ✅ Fix: Added explicit CompanyRepresentative type assignment to map loop payload parameters */}
            {representatives.map((rep: CompanyRepresentative) => {
              const proofDocUrl =
                (rep as any).proofDocument?.url ||
                (rep.proofDocumentId ? getFileUrl(rep.proofDocumentId) : null);

              return (
                <div
                  key={rep.id}
                  className="p-6 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2">
                        <h4 className="font-medium text-slate-900 text-lg">
                          {rep.name}
                        </h4>
                        <p className="text-sm text-slate-500">
                          {rep.designation}
                        </p>
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
                            Proof Document:{" "}
                            {proofDocUrl ? "Uploaded" : "Not uploaded"}
                          </span>
                        </div>
                      </div>

                      {proofDocUrl && (
                        <a
                          href={proofDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Proof Document
                        </a>
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

      {/* Forms & Dialog Modals */}
      {showAddPerson && (
        <AddRepresentativeForm
          onSubmit={handleAddRepresentative}
          isLoading={isLoading || isCreating}
          onClose={() => setShowAddPerson(false)}
        />
      )}
      {showEditPerson && (
        <EditRepresentativeModal
          representative={showEditPerson}
          onSubmit={handleEditRepresentative}
          isLoading={isLoading || isUpdating}
          onClose={() => setShowEditPerson(null)}
        />
      )}

      {showDeletePerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-center text-slate-900 mb-2">
              Remove Representative
            </h3>
            <p className="text-sm text-center text-slate-500 mb-4">
              Are you sure you want to proceed? This step is permanent.
            </p>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowDeletePerson(null)}
                className="flex-1 px-4 py-2 border text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRepresentative}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {isDeleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompanyDocumentModal && registrationDocUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">
                Registration Document Preview
              </h3>
              <button
                onClick={() => setShowCompanyDocumentModal(false)}
                className="p-1 hover:bg-slate-100 rounded"
              >
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
