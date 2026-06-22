import { useEffect, useState } from 'react';
import { Plus, Eye, Trash2, User, Loader2, Mail, Globe, Edit, Briefcase, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTeacherStore } from '../../../store/teacher.store';
import { useAppQuery, useAppMutation } from '../../../lib/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { Teacher } from '../../../interfaces/teacher.interface';
import { getFileUrl } from '../../../lib/file-upload';
import toast, { Toaster } from 'react-hot-toast';
import Pagination from '../../../components/UI/Pagination';

export const TeacherManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setTeachers, deleteTeacher: deleteFromStore } = useTeacherStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch teachers
  const { data: fetchedTeachers, isLoading } = useAppQuery<Teacher[]>({
    url: "/teachers/",
    queryKey: ["teachers"],
  });

  const { mutate: deleteTeacherApi } = useAppMutation({
    url: "/teachers",
    type: "delete",
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      setIsDeleting(false);
      toast.success('Teacher deleted successfully');
      setShowDeleteModal(null);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to delete teacher');
      setIsDeleting(false);
    },
  });

  // Use fallback for teachers
  const teachersData = fetchedTeachers ?? [];
  console.log(teachersData, "fetchedTeachers");

  useEffect(() => {
    if (fetchedTeachers?.length) {
      setTeachers(fetchedTeachers);
    }
  }, [fetchedTeachers, setTeachers]);

  const safeTeachers = teachersData;

  const filteredTeachers = safeTeachers.filter((teacher: Teacher) => {
    const name = teacher?.name || '';
    const email = teacher?.email || '';
    const country = teacher?.country || '';
    const role = teacher?.role || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         role.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = true;
    if (filterRole === 'teacher') matchesRole = role === 'teacher';
    if (filterRole === 'counselor') matchesRole = role === 'counselor';
    
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

  const handleFilterChange = (value: string) => {
    setFilterRole(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getRoleBadgeColor = (role: string | undefined) => {
    if (role === 'teacher') {
      return 'bg-blue-100 text-blue-700';
    } else if (role === 'counselor') {
      return 'bg-purple-100 text-purple-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  const handleDelete = (id: string) => {
    setIsDeleting(true);
    deleteTeacherApi({ id });
    deleteFromStore(id);
    setShowDeleteModal(null);
  };

  const getProfileUrl = (teacher: Teacher) => {
    if (teacher?.profile && typeof teacher.profile === 'object' && teacher.profile.url) {
      return getFileUrl(teacher.profile.url);
    }
    return null;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
        <h1 className="text-slate-500">Loading teachers...</h1>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <Toaster position="top-right" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Teacher Management</h1>
          <p className="page-subtitle">
            Manage all teachers and counselors
          </p>
        </div>
        <button
          onClick={() => navigate('/teachers/add')}
          className="flex items-center gap-2 font-aeonik bg-brand-primary text-white px-4 py-2 rounded-lg hover:bg-brand transition-colors shadow-sm cursor-pointer duration-500"
        >
          <Plus className="h-4 w-4" />
          <span>Add Teacher</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm font-aeonik">
        <div className="p-4 border-b border-slate-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email, country or role..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex gap-2">
              <select
                value={filterRole}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Roles</option>
                <option value="teacher">Teacher</option>
                <option value="counselor">Counselor</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">SN</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Teacher</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Country</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Enrollment Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Proof Document</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentTeachers.length > 0 ? (
                currentTeachers.map((teacher: Teacher, index) => {
                  const profileUrl = getProfileUrl(teacher);
                  const serialNumber = startIndex + index + 1;
                  
                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-slate-600">{serialNumber}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {profileUrl ? (
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                              <img 
                                src={profileUrl} 
                                alt={teacher.name} 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-slate-900">{teacher.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{teacher.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{teacher.country}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(teacher.role)}`}>
                          <Briefcase className="h-3 w-3 mr-1" />
                          {teacher.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">{formatDate(teacher.enrollmentDate)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {teacher.proofDocument ? (
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600 truncate max-w-80">
                              {teacher.proofDocument}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">No document</span>
                        )}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => navigate(`/teachers/${teacher.id}`)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => navigate(`/teachers/edit/${teacher.id}`)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Edit Teacher"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => setShowDeleteModal(teacher.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12">
                    <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No teachers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredTeachers.length > 0 && (
          <div className="px-4 py-3 border-t border-slate-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredTeachers.length}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-center text-slate-900 mb-2">Delete Teacher</h3>
              <p className="text-sm text-center text-slate-500 mb-6">
                Are you sure you want to delete this teacher? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteModal)}
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