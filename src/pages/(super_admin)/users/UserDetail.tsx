import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Phone, MapPin, FileText, Users as UsersIcon, Edit, Trash2, X, CreditCard, Activity, UserPlus, Building, Globe, Loader2,
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
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const companyId = id || "";

  // Fetch single admin by ID
  const { data: adminData, isLoading: isLoadingAdmin } = useAppQuery<Admin>({
    url: companyId ? `/admins/${companyId}` : "",
    queryKey: ["admin", companyId],
    enabled: !!companyId,
  });

  const admin = adminData || admins.find((a) => a.id === companyId);

  const {
    data: representativesData,
    refetch: refetchRepresentatives,
    isLoading: isLoadingReps,
  } = useAppQuery<CompanyRepresentative[]>({
    url: companyId ? `/company-representatives/admin/${companyId}` : "",
    queryKey: ["representatives", companyId],
    enabled: !!companyId,
  });

  const { mutate: updateAdminStatus, isPending: isStatusUpdating } =
    useAppMutation({
      url: `/admins/${companyId}`,
      type: "patch",
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin", companyId] });
        queryClient.invalidateQueries({ queryKey: ["admins"] });
        setShowStatusDropdown(false);
        toast.success("Company status updated successfully!");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to update company status"
        );
      },
    });

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

  const handleStatusChange = (newStatus: boolean) => {
    if (!admin) return;

    setIsUpdatingStatus(true);
    updateAdminStatus({
      data: {
        isActive: newStatus,
      },
    });
    setIsUpdatingStatus(false);
  };

  const handleAddRepresentative = async (values: any) => {
    if (!admin?.id) {
      toast.error("Admin ID is missing. Please refresh.");
      return;
    }

    setIsLoading(true);
    try {
      let proofDocumentId = null;

      if (values.proofDocumentFile) {
        if (
          typeof values.proofDocumentFile === "object" &&
          values.proofDocumentFile.id
        ) {
          proofDocumentId = values.proofDocumentFile.id;
        } else if (typeof values.proofDocumentFile === "string") {
          proofDocumentId = values.proofDocumentFile;
        }
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
      let proofDocumentId = null;

      if (values.proofDocumentId) {
        if (typeof values.proofDocumentId === "string") {
          proofDocumentId = values.proofDocumentId;
        } else if (
          typeof values.proofDocumentId === "object" &&
          values.proofDocumentId.id
        ) {
          proofDocumentId = values.proofDocumentId.id;
        }
      } else if (values.proofDocumentFile) {
        proofDocumentId = values.proofDocumentFile.id;
      } else if (
        values.proofDocumentId !== null &&
        showEditPerson.proofDocumentId
      ) {
        if (typeof showEditPerson.proofDocumentId === "string") {
          proofDocumentId = showEditPerson.proofDocumentId;
        } else if (typeof showEditPerson.proofDocumentId === "object") {
          proofDocumentId = (showEditPerson.proofDocumentId as any).id || null;
        }
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
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
      <div className="bg-linear-to-br from-brand to-brand-light/80 rounded-2xl shadow-xl overflow-visible border border-white/10">
        <div className="px-6 py-6 md:px-8 md:py-7">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-5 min-w-0">
              {logoUrl && !logoError ? (
                <div className="h-20 w-20 rounded-2xl bg-white p-1 shadow-xl shrink-0 ring-2 ring-white/20">
                  <img
                    src={logoUrl}
                    alt={admin.companyName}
                    className="h-full w-full object-cover rounded-xl"
                    onError={(e) => {
                      console.error("Logo failed to load:", logoUrl);
                      setLogoError(true);
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl shrink-0">
                  <span className="text-white font-bold text-2xl tracking-wider">
                    {admin?.companyName
                      ?.split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "C"}
                  </span>
                </div>
              )}

              {/* Company Details */}
              <div className="min-w-0 flex-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight truncate">
                  {admin.companyName}
                </h2>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-indigo-200/70 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <p className="text-indigo-100/90 text-sm font-medium truncate">
                      {admin.country}
                    </p>
                  </div>

                  <span className="text-indigo-300/40 text-xs">•</span>

                  <div className="flex items-center gap-1.5">
                    <svg
                      className="w-4 h-4 text-indigo-200/70 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-indigo-100/90 text-sm font-mono truncate">
                      PAN: {admin.panNo}
                    </p>
                  </div>

                  {admin.website && (
                    <>
                      <span className="text-indigo-300/40 text-xs">•</span>
                      <a
                        href={admin.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-indigo-100/80 text-sm hover:text-white transition-all duration-200 group"
                      >
                        <svg
                          className="w-4 h-4 shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"
                          />
                        </svg>
                        <span className="border-b border-transparent group-hover:border-white/50 transition-all duration-200">
                          Website
                        </span>
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Section - Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => navigate(`/user/${companyId}/payment`)}
                className="group px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white cursor-pointer text-sm font-medium flex items-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                <CreditCard className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Payment</span>
              </button>

              {/* Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="group px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white cursor-pointer text-sm font-medium flex items-center gap-2 transition-all duration-200 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Activity className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Status</span>
                  <span
                    className={`ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      admin.isActive
                        ? "bg-green-500/20 text-green-200"
                        : "bg-red-500/20 text-red-200"
                    }`}
                  >
                    {admin.isActive ? "Active" : "Inactive"}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showStatusDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowStatusDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200/80 z-50 overflow-hidden">
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            handleStatusChange(true);
                          }}
                          disabled={isStatusUpdating || admin.isActive}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                            admin.isActive
                              ? "bg-green-50 text-green-700 cursor-default"
                              : "hover:bg-green-50 text-slate-700 hover:text-green-700"
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              admin.isActive ? "bg-green-500" : "bg-green-400"
                            }`}
                          />
                          <span>Active</span>
                          {admin.isActive && (
                            <svg
                              className="h-4 w-4 ml-auto text-green-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          {isStatusUpdating && !admin.isActive && (
                            <Loader2 className="h-4 w-4 ml-auto animate-spin text-green-600" />
                          )}
                        </button>

                        <button
                          onClick={() => {
                            handleStatusChange(false);
                          }}
                          disabled={isStatusUpdating || !admin.isActive}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
                            !admin.isActive
                              ? "bg-red-50 text-red-700 cursor-default"
                              : "hover:bg-red-50 text-slate-700 hover:text-red-700"
                          }`}
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${
                              !admin.isActive ? "bg-red-500" : "bg-red-400"
                            }`}
                          />
                          <span>Inactive</span>
                          {!admin.isActive && (
                            <svg
                              className="h-4 w-4 ml-auto text-red-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                          {isStatusUpdating && admin.isActive && (
                            <Loader2 className="h-4 w-4 ml-auto animate-spin text-red-600" />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info & Registration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company Information Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 p-6 hover:shadow-xl transition-shadow duration-300">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2.5 text-base">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <Building className="h-4 w-4 text-indigo-600" />
            </div>
            Company Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Email
                </p>
                <p className="text-slate-700 font-medium truncate">
                  {admin.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Address
                </p>
                <p className="text-slate-700">{admin.companyAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
              <Globe className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                  Country
                </p>
                <p className="text-slate-700 font-medium">{admin.country}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Document Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 p-6 hover:shadow-xl transition-shadow duration-300">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2.5 text-base">
            <div className="p-1.5 bg-indigo-50 rounded-lg">
              <FileText className="h-4 w-4 text-indigo-600" />
            </div>
            Registration Document
          </h3>
          <div className="flex flex-col items-center justify-center h-[calc(100%-2rem)] min-h-[500]">
            {registrationDocUrl ? (
              <button
                onClick={() => setShowCompanyDocumentModal(true)}
                className="group w-full flex flex-col items-center gap-3 p-6 bg-slate-50/80 hover:bg-indigo-50/50 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-300 transition-all duration-200"
              >
                <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">
                    View Registration Document
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Click to open document
                  </p>
                </div>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-2 p-6">
                <div className="p-3 bg-slate-100 rounded-xl">
                  <FileText className="h-6 w-6 text-slate-300" />
                </div>
                <p className="text-sm text-slate-400 font-medium">
                  No document uploaded
                </p>
                <p className="text-xs text-slate-300">
                  Registration document not available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Representatives Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg shadow-slate-100/50 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6 border-b border-slate-200/80 bg-linear-to-r from-slate-50/50 to-transparent">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-semibold text-slate-900 text-lg flex items-center gap-2.5">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <UsersIcon className="h-4 w-4 text-indigo-600" />
                </div>
                Company Representatives
              </h3>
              <p className="text-sm text-slate-500 mt-1 ml-1">
                {representatives.length > 0
                  ? `${representatives.length} contact${
                      representatives.length > 1 ? "s" : ""
                    } available`
                  : "No representatives added yet"}
              </p>
            </div>
          </div>
        </div>

        {isLoadingReps ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="h-12 w-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
            </div>
            <p className="text-slate-500 mt-4 text-sm font-medium">
              Loading representatives...
            </p>
          </div>
        ) : representatives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <UsersIcon className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">
              No representatives added yet
            </p>
            <p className="text-sm text-slate-400 mt-1 mb-4">
              Add your first company representative
            </p>
            <button
              onClick={() => setShowAddPerson(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-medium transition-colors"
            >
              <UserPlus className="h-4 w-4" /> Add Representative
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {representatives.map((rep: CompanyRepresentative) => {
              const proofDocUrl =
                (rep as any).proofDocument?.url ||
                (rep.proofDocumentId ? getFileUrl(rep.proofDocumentId) : null);

              return (
                <div
                  key={rep.id}
                  className="p-6 hover:bg-slate-50/80 transition-all duration-200 group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-base flex items-center gap-2">
                            {rep.name}
                            <span className="text-xs font-normal bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                              {rep.designation}
                            </span>
                          </h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors">
                          <div className="p-1 bg-slate-100 rounded-md">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <span className="text-slate-600 truncate">
                            {rep.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white transition-colors">
                          <div className="p-1 bg-slate-100 rounded-md">
                            <Phone className="h-3.5 w-3.5 text-slate-400" />
                          </div>
                          <span className="text-slate-600">{rep.contact}</span>
                        </div>
                      </div>

                      {proofDocUrl && (
                        <div className="mt-3">
                          <a
                            href={proofDocUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" />
                            View Proof Document
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setShowEditPerson(rep)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setShowDeletePerson(rep.id!)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Proof document status indicator */}
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          proofDocUrl ? "bg-green-500" : "bg-slate-300"
                        }`}
                      ></div>
                      <span className="text-xs text-slate-400">
                        {proofDocUrl
                          ? "Proof document uploaded"
                          : "No proof document"}
                      </span>
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
