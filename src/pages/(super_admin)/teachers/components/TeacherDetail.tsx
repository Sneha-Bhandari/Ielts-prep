import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, User, Mail, Phone, Globe, Briefcase, Calendar, FileImage, File } from 'lucide-react';
import { useTeacherStore } from '../../../../store/teacher.store';
import { useAppQuery } from '../../../../lib/react-query';
import { getFileUrl } from '../../../../lib/file-upload';
import type { Teacher } from '../../../../interfaces/teacher.interface';

export const TeacherDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getTeacherById } = useTeacherStore();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [proofImageError, setProofImageError] = useState(false);

  const { 
    data: teacherData, 
    isLoading: isFetching,
    error: fetchError,
  } = useAppQuery<Teacher>({
    url: id ? `/teachers/${id}` : "",
    queryKey: ["teacher", id || ""],
    enabled: !!id,
  });

  const getRoleBadgeColor = (role: string | undefined) => {
    if (role === 'teacher') {
      return 'bg-blue-100 text-blue-700';
    } else if (role === 'counselor') {
      return 'bg-purple-100 text-purple-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    if (teacherData) {
      setTeacher(teacherData);
      
      if (teacherData.profile) {
        const url = getFileUrl(teacherData.profile);
        console.log('Profile URL:', url); 
        setProfileUrl(url);
        setImageError(false);
      } else {
        setProfileUrl(null);
      }
    } else if (!isFetching && id) {
      const teacherFromStore = getTeacherById(id);
      if (teacherFromStore) {
        setTeacher(teacherFromStore);
        
        if (teacherFromStore.profile) {
          const url = getFileUrl(teacherFromStore.profile);
          console.log('Profile URL from store:', url); 
          setProfileUrl(url);
          setImageError(false);
        } else {
          setProfileUrl(null);
        }
      }
    }
  }, [teacherData, isFetching, id, getTeacherById]);

  const handleImageError = () => {
    console.log('Image failed to load, showing fallback');
    setImageError(true);
  };

  const handleProofImageError = () => {
    setProofImageError(true);
  };
  
  if (isFetching) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-slate-500">Loading teacher details...</p>
      </div>
    );
  }

  if (fetchError || !teacher) {
    return (
      <div className="flex flex-col justify-center items-center min-h-64 gap-4 p-6">
        <div className="text-red-500 text-lg">⚠️ Teacher not found</div>
        <p className="text-slate-500 text-sm">The teacher you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/teachers')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to Teachers
        </button>
      </div>
    );
  }

  const proofDocumentUrl = teacher.proofDocument ? getFileUrl(teacher.proofDocument) : null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/teachers')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Details</h1>
          <p className="text-sm text-slate-500 mt-1">View complete teacher information</p>
        </div>
      </div>

      {/* Teacher Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Profile Header */}
        <div className="bg-linear-to-r from-indigo-50 to-blue-50 p-6 border-b border-slate-200">
          <div className="flex items-center gap-6">
            <div className="relative">
              {profileUrl && !imageError ? (
                <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img 
                    src={profileUrl} 
                    alt={teacher.name} 
                    className="h-full w-full object-cover"
                    onError={handleImageError}
                    onLoad={() => console.log('Image loaded successfully')}
                  />
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-lg">
                  {teacher.name ? (
                    <span className="text-3xl font-bold text-indigo-600">
                      {teacher.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="h-12 w-12 text-indigo-600" />
                  )}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{teacher.name}</h2>
              <p className="text-sm text-slate-600 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {teacher.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(teacher.role)}`}>
                  <Briefcase className="h-3 w-3 mr-1" />
                  {teacher.role || 'Unspecified'}
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
                    <p className="text-sm font-medium text-slate-900">{teacher.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-900">{teacher.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{teacher.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Country</p>
                    <p className="text-sm font-medium text-slate-900">{teacher.country}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-2">
                Employment Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Role</p>
                    <p className="text-sm font-medium text-slate-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(teacher.role)}`}>
                        {teacher.role || 'Not specified'}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Enrollment Date</p>
                    <p className="text-sm font-medium text-slate-900">
                      {formatDate(teacher.enrollmentDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileImage className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-500">Proof Document</p>
                    {teacher.proofDocument && proofDocumentUrl ? (
                      <div className="mt-1">
                        {!proofImageError ? (
                          <img 
                            src={proofDocumentUrl} 
                            alt="Proof Document"
                            className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                            onError={handleProofImageError}
                          />
                        ) : (
                          <div className="w-32 h-32 flex items-center justify-center bg-slate-100 rounded-lg border border-slate-200">
                            <File className="h-12 w-12 text-slate-400" />
                          </div>
                        )}
                        <a 
                          href={proofDocumentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-800 underline mt-1 inline-block"
                        >
                          View Full Document
                        </a>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">No document provided</p>
                    )}
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