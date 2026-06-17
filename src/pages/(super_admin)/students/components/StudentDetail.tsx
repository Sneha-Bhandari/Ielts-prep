import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Mail, Phone, Globe, Target, GraduationCap, Calendar, Building2, Edit, Trash2 } from 'lucide-react';
import { useStudentStore } from '../../../../store/student.store';
import { useAdminStore } from '../../../../store/admin.store';
import { useAppQuery, useAppMutation } from '../../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { getFileUrl } from '../../../../lib/file-upload';
import type { Student } from '../../../../interfaces/student.interface';
import toast from 'react-hot-toast';

export const StudentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { getStudentById, deleteStudent: deleteFromStore } = useStudentStore();
  const { admins } = useAdminStore();
  const [student, setStudent] = useState<Student | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Fetch student from backend
  const { 
    data: studentData, 
    isLoading: isFetching,
    error: fetchError,
  } = useAppQuery<Student>({
    url: id ? `/students/${id}` : "",
    queryKey: ["student", id || ""],
    enabled: !!id,
  });

  const { mutate: deleteStudentApi } = useAppMutation({
    url: "/students",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setIsDeleting(false);
      deleteFromStore(id!);
      toast.success('Student deleted successfully');
      navigate('/students');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete student');
      setIsDeleting(false);
    },
  });

  useEffect(() => {
    if (studentData) {
      setStudent(studentData);
      
      const admin = admins.find(a => 
        a.companyId === studentData.companyId || a.id === studentData.companyId
      );
      setCompanyName(admin?.companyName || 'Not specified');
      
      if (studentData.avatar) {
        const url = getFileUrl(studentData.avatar);
        console.log('Avatar URL:', url); 
        setAvatarUrl(url);
        setImageError(false);
      } else {
        setAvatarUrl(null);
      }
    } else if (!isFetching && id) {
      const studentFromStore = getStudentById(id);
      if (studentFromStore) {
        setStudent(studentFromStore);
        const admin = admins.find(a => 
          a.companyId === studentFromStore.companyId || a.id === studentFromStore.companyId
        );
        setCompanyName(admin?.companyName || 'Not specified');
        
        if (studentFromStore.avatar) {
          const url = getFileUrl(studentFromStore.avatar);
          console.log('Avatar URL from store:', url); 
          setAvatarUrl(url);
          setImageError(false);
        } else {
          setAvatarUrl(null);
        }
      }
    }
  }, [studentData, isFetching, id, getStudentById, admins]);

  const handleDelete = () => {
    setIsDeleting(true);
    deleteStudentApi({ id });
  };

  const handleImageError = () => {
    console.log('Image failed to load, showing fallback');
    setImageError(true);
  };

  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-slate-500">Loading student details...</p>
      </div>
    );
  }

  if (fetchError || !student) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4 p-6">
        <div className="text-red-500 text-lg">⚠️ Student not found</div>
        <p className="text-slate-500 text-sm">The student you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/students')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/students')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Student Details</h1>
            <p className="text-sm text-slate-500 mt-1">View complete student information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/students/edit/${student.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Student Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-linear-to-r from-indigo-50 to-blue-50 p-6 border-b border-slate-200">
          <div className="flex items-center gap-6">
            <div className="relative">
              {avatarUrl && !imageError ? (
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={avatarUrl} 
                    alt={student.name} 
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                    onLoad={() => console.log('Image loaded successfully')}
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                  {student.name ? (
                    <span className="text-3xl font-bold text-indigo-600">
                      {student.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-12 w-12 text-indigo-600" />
                  )}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {student.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  student.isExternal ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                }`}>
                  {student.isExternal ? 'External' : 'Internal'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="text-sm font-medium text-slate-900">{student.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-900">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{student.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Country</p>
                    <p className="text-sm font-medium text-slate-900">{student.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                Academic Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Target Exam</p>
                    <p className="text-sm font-medium text-slate-900">{student.targetExam}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Target className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Target Band</p>
                    <p className="text-sm font-medium text-slate-900">{student.targetBand}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Current Level</p>
                    <p className="text-sm font-medium text-slate-900">{student.currentLevel}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Enrollment Date</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(student.enrollmentDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                Company Information
              </h3>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="text-sm font-medium text-slate-900">{companyName}</p>
                  <p className="text-xs text-slate-400">Company ID: {student.companyId}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-center text-slate-900 mb-2">Delete Student</h3>
              <p className="text-sm text-center text-slate-500 mb-6">
                Are you sure you want to delete this student? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};