import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { StudentForm } from "./StudentForm";
import { useStudentStore } from "../../../../store/student.store";
import { useAppQuery, useAppMutation } from "../../../../lib/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { getFileUrl } from "../../../../lib/file-upload";
import type { Student } from "../../../../interfaces/student.interface";
import type { StudentFormData } from "../../../../schema/student.schema";
import toast from "react-hot-toast";

interface IeltsType {
  id: string;
  name: string;
  description: string;
}

interface IeltsResponse {
  id: string;
  title: string;
  description: string;
  ieltsType: IeltsType;
  thumbnail: any;
  isPublished: boolean;
  price: string;
  sections: any[];
}

interface IeltsOption {
  id: string;
  title: string;
  typeName: string;
  displayName: string;
}

export const EditStudent: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { getStudentById, updateStudent } = useStudentStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [initialValues, setInitialValues] = useState<StudentFormData | undefined>();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [ieltsOptions, setIeltsOptions] = useState<IeltsOption[]>([]);

  const { data: fetchedIelts, isLoading: isLoadingIelts } = useAppQuery<IeltsResponse[]>({
    url: "/ielts/published",
    queryKey: ["ielts"],
  });

  useEffect(() => {
    const ieltsData = fetchedIelts || [];
    if (ieltsData.length > 0) {
      const options = ieltsData.map((ielts) => ({
        id: ielts.id, 
        title: ielts.title,
        typeName: ielts.ieltsType?.name || 'Unknown Type',
        displayName: `${ielts.title} (${ielts.ieltsType?.name || 'Unknown Type'})`
      }));
      
      setIeltsOptions(options);
    }
  }, [fetchedIelts]);

  const {
    data: studentData,
    isLoading: isFetching,
    error: fetchError,
    refetch,
  } = useAppQuery<Student>({
    url: id ? `/students/${id}` : "",
    queryKey: ["student", id || ""],
    enabled: !!id,
  });

  const { mutate: updateStudentApi, isPending: isUpdating } = useAppMutation({
    url: `/students`,
    type: "patch",
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", id] });

      if (data) {
        updateStudent(id!, data);
      }

      toast.success("Student updated successfully!");
      navigate("/students");
    },
    onError: (error: any) => {
      console.error("Update error:", error);
      toast.error(error?.response?.data?.message || "Failed to update student");
      setIsSaving(false);
    },
  });

  const getExamId = (student: Student): string => {
    if (!student.targetExam) return '';
    
    if (typeof student.targetExam === 'object' && student.targetExam !== null) {
      return student.targetExam.id || '';
    }
    if (typeof student.targetExam === 'string') {
      return student.targetExam;
    }
    return '';
  };

  useEffect(() => {
    if (studentData) {
      console.log("Student data loaded:", studentData);

      const targetBandNum =
        typeof studentData.targetBand === "string"
          ? parseFloat(studentData.targetBand)
          : Number(studentData.targetBand) || 0;

      const examId = getExamId(studentData);

      setInitialValues({
        name: studentData.name || "",
        email: studentData.email || "",
        phone: studentData.phone || "",
        avatar: studentData.avatar?.id || "",
        country: studentData.country || "",
        targetBand: targetBandNum,
        targetExam: examId,
        currentLevel: String(studentData.currentLevel || "").trim(),
        enrollmentDate: studentData.enrollmentDate
          ? new Date(studentData.enrollmentDate).toISOString().slice(0, 16)
          : new Date().toISOString().slice(0, 16),
        isExternal: studentData.isExternal || false,
      });

      if (studentData.avatar) {
        const url = getFileUrl(studentData.avatar);
        if (url) setAvatarUrl(url);
      }
      setIsLoading(false);
    }
  }, [studentData]);

  useEffect(() => {
    if (!isFetching && !studentData && id) {
      const student = getStudentById(id);
      if (student) {
        console.log("Using student from store:", student);

        const targetBandNum =
          typeof student.targetBand === "string"
            ? parseFloat(student.targetBand)
            : Number(student.targetBand) || 0;

        const examId = getExamId(student);

        setInitialValues({
          name: student.name || "",
          email: student.email || "",
          phone: student.phone || "",
          avatar: student.avatar?.id || "",
          country: student.country || "",
          targetBand: targetBandNum,
          targetExam: examId, // Use the extracted ID
          currentLevel: student.currentLevel || "",
          enrollmentDate: student.enrollmentDate
            ? new Date(student.enrollmentDate).toISOString().slice(0, 16)
            : new Date().toISOString().slice(0, 16),
          isExternal: student.isExternal || false,
        });
        if (student.avatar) {
          const url = getFileUrl(student.avatar);
          if (url) setAvatarUrl(url);
        }
        setIsLoading(false);
      } else if (!isFetching) {
        toast.error("Student not found");
        navigate("/students");
      }
    }
  }, [
    isFetching,
    studentData,
    id,
    getStudentById,
    navigate,
  ]);

  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching student:", fetchError);
      if (id) {
        const student = getStudentById(id);
        if (student) {
          console.log("Using student from store after API error:", student);

          const targetBandNum =
            typeof student.targetBand === "string"
              ? parseFloat(student.targetBand)
              : Number(student.targetBand) || 0;

          const examId = getExamId(student);

          setInitialValues({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            avatar: student.avatar?.id || "",
            country: student.country || "",
            targetBand: targetBandNum,
            targetExam: examId, 
            currentLevel: student.currentLevel || "",
            enrollmentDate: student.enrollmentDate
              ? new Date(student.enrollmentDate).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
            isExternal: student.isExternal || false,
          });
          if (student.avatar) {
            const url = getFileUrl(student.avatar);
            if (url) setAvatarUrl(url);
          }
          setIsLoading(false);
        } else {
          toast.error("Failed to load student data");
        }
      }
    }
  }, [fetchError, id, getStudentById]);

  const handleSubmit = async (values: StudentFormData) => {
    try {
      setIsSaving(true);

      const currentStudent = studentData || getStudentById(id!);

      let avatarId = values.avatar || currentStudent?.avatar?.id || null;

      const updateData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        avatarid: avatarId,
        country: values.country,
        targetBand: values.targetBand,
        targetExam: values.targetExam || '',
        currentLevel: values.currentLevel,
        enrollmentDate: values.enrollmentDate,
        isExternal: values.isExternal,
      };

      console.log("Updating student with data:", updateData);

      updateStudentApi({
        id: id!,
        data: updateData,
      });
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Failed to update student");
      setIsSaving(false);
    }
  };

  if (isLoading || isFetching || isLoadingIelts) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-slate-500">Loading student data...</p>
      </div>
    );
  }

  if (fetchError && !initialValues) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4 p-6">
        <div className="text-red-500 text-lg">
          ⚠️ Failed to load student data
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
            onClick={() => navigate("/students")}
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
          onClick={() => navigate("/students")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          disabled={isSaving || isUpdating}
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Edit Student</h1>
          <p className="text-sm text-slate-500 mt-1">
            Update student information
          </p>
        </div>
      </div>

      {initialValues && (
        <StudentForm
          onSubmit={handleSubmit}
          isLoading={isSaving || isUpdating}
          initialValues={initialValues}
          isEditing={true}
          avatarUrl={avatarUrl}
          ieltsOptions={ieltsOptions}
        />
      )}
    </div>
  );
};