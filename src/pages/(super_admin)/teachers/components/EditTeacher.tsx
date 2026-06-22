import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { TeacherForm } from "./TeacherForm";
import { useTeacherStore } from "../../../../store/teacher.store";
import { useAppQuery, useAppMutation } from "../../../../lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getFileUrl } from "../../../../lib/file-upload";
import type { Teacher } from "../../../../interfaces/teacher.interface";
import type { TeacherFormData } from "../../../../schema/teacher.schema";
import toast from "react-hot-toast";

export const EditTeacher: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { getTeacherById, updateTeacher } = useTeacherStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialValues, setInitialValues] = useState<TeacherFormData | undefined>();
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const {
    data: teacherData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useAppQuery<Teacher>({
    url: id ? `/teachers/${id}` : "",
    queryKey: ["teacher", id || ""],
    enabled: !!id,
  });

  const { mutate: updateTeacherApi, isPending: isUpdating } = useAppMutation({
    url: `/teachers`,
    type: "patch",
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      queryClient.invalidateQueries({ queryKey: ["teacher", id] });

      if (data) {
        updateTeacher(id!, data);
      }

      toast.success("Teacher updated successfully!");
      navigate("/teachers");
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update teacher");
      setIsSaving(false);
    },
  });

  useEffect(() => {
    if (teacherData) {
      console.log("Teacher data loaded:", teacherData);

      setInitialValues({
        name: teacherData.name || "",
        email: teacherData.email || "",
        phone: teacherData.phone || "",
        profile: teacherData.profile?.id || "",
        country: teacherData.country || "",
        role: teacherData.role || "teacher",
        enrollmentDate: teacherData.enrollmentDate
          ? new Date(teacherData.enrollmentDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        proofDocument: teacherData.proofDocument || "",
      });

      if (teacherData.profile) {
        const url = getFileUrl(teacherData.profile);
        if (url) setProfileUrl(url);
      }
      setIsLoading(false);
    }
  }, [teacherData]);

  useEffect(() => {
    if (!isFetching && !teacherData && id) {
      const teacher = getTeacherById(id);
      if (teacher) {
        console.log("Using teacher from store:", teacher);

        setInitialValues({
          name: teacher.name || "",
          email: teacher.email || "",
          phone: teacher.phone || "",
          profile: teacher.profile?.id || "",
          country: teacher.country || "",
          role: teacher.role || "teacher",
          enrollmentDate: teacher.enrollmentDate
            ? new Date(teacher.enrollmentDate).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          proofDocument: teacher.proofDocument || "",
        });
        if (teacher.profile) {
          const url = getFileUrl(teacher.profile);
          if (url) setProfileUrl(url);
        }
        setIsLoading(false);
      } else if (!isFetching) {
        toast.error("Teacher not found");
        navigate("/teachers");
      }
    }
  }, [isFetching, teacherData, id, getTeacherById, navigate]);

  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching teacher:", fetchError);
      if (id) {
        const teacher = getTeacherById(id);
        if (teacher) {
          console.log("Using teacher from store after API error:", teacher);

          setInitialValues({
            name: teacher.name || "",
            email: teacher.email || "",
            phone: teacher.phone || "",
            profile: teacher.profile?.id || "",
            country: teacher.country || "",
            role: teacher.role || "teacher",
            enrollmentDate: teacher.enrollmentDate
              ? new Date(teacher.enrollmentDate).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            proofDocument: teacher.proofDocument || "",
          });
          if (teacher.profile) {
            const url = getFileUrl(teacher.profile);
            if (url) setProfileUrl(url);
          }
          setIsLoading(false);
        } else {
          toast.error("Failed to load teacher data");
        }
      }
    }
  }, [fetchError, id, getTeacherById]);

  const handleSubmit = async (values: TeacherFormData) => {
    try {
      setIsSaving(true);

      const currentTeacher = teacherData || getTeacherById(id!);

      let profileId = values.profile || currentTeacher?.profile?.id || null;

      const updateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        profileid: profileId,
        country: values.country,
        role: values.role,
        enrollmentDate: values.enrollmentDate,
        proofDocument: values.proofDocument,
      };

      console.log("Updating teacher with data:", updateData);

      updateTeacherApi({
        id: id!,
        data: updateData,
      });
    } catch (error) {
      console.error("Error updating teacher:", error);
      toast.error("Failed to update teacher");
      setIsSaving(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-slate-500">Loading teacher data...</p>
      </div>
    );
  }

  if (fetchError && !initialValues) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4 p-6">
        <div className="text-red-500 text-lg">
          ⚠️ Failed to load teacher data
        </div>
        <p className="text-slate-500 text-sm">
          {(fetchError as any)?.message || "Please try again"}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => navigate("/teachers")}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/teachers")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          disabled={isSaving || isUpdating}
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Teacher</h1>
          <p className="text-sm text-slate-500 mt-1">
            Update teacher information
          </p>
        </div>
      </div>

      {initialValues && (
        <TeacherForm
          onSubmit={handleSubmit}
          isLoading={isSaving || isUpdating}
          initialValues={initialValues}
          isEditing={true}
          profileUrl={profileUrl}
        />
      )}
    </div>
  );
};