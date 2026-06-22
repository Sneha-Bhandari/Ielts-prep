import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Mail, Phone, Globe, Target, GraduationCap, Calendar } from 'lucide-react';
import { useStudentStore } from '../../../../store/student.store';
import { useAppQuery } from '../../../../lib/react-query';
import { getFileUrl } from '../../../../lib/file-upload';
import type { Student } from '../../../../interfaces/student.interface';

export const StudentDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getStudentById } = useStudentStore();
  const [student, setStudent] = useState<Student | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [examDisplayName, setExamDisplayName] = useState<string>('');

  const { 
    data: studentData, 
    isLoading: isFetching,
    error: fetchError,
  } = useAppQuery<Student>({
    url: id ? `/students/${id}` : "",
    queryKey: ["student", id || ""],
    enabled: !!id,
  });

  const getExamDisplayName = (student: Student): string => {
    if (!student.targetExam) return 'N/A';
    
    if (typeof student.targetExam === 'object' && student.targetExam !== null) {
      const examObj = student.targetExam;
      return `${examObj.title} `;
    }
    
    return 'N/A';
  };

  useEffect(() => {
    if (studentData) {
      setStudent(studentData);
      
      if (studentData.avatar) {
        const url = getFileUrl(studentData.avatar);
        console.log('Avatar URL:', url); 
        setAvatarUrl(url);
        setImageError(false);
      } else {
        setAvatarUrl(null);
      }

      // Set exam display name from the student object
      const displayName = getExamDisplayName(studentData);
      setExamDisplayName(displayName);
      
    } else if (!isFetching && id) {
      const studentFromStore = getStudentById(id);
      if (studentFromStore) {
        setStudent(studentFromStore);
        
        if (studentFromStore.avatar) {
          const url = getFileUrl(studentFromStore.avatar);
          console.log('Avatar URL from store:', url); 
          setAvatarUrl(url);
          setImageError(false);
        } else {
          setAvatarUrl(null);
        }
        const displayName = getExamDisplayName(studentFromStore);
        setExamDisplayName(displayName);
      }
    }
  }, [studentData, isFetching, id, getStudentById]);

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
      <div className="flex items-center gap-4 mb-6">
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
                    <p className="text-sm font-medium text-slate-900">
                      {examDisplayName}
                    </p>
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
          </div>
        </div>
      </div>
    </div>
  );
};