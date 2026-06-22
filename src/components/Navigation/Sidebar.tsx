import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  UserCheck, 
  GraduationCap 
} from "lucide-react";
import { IoIosPeople } from "react-icons/io";

const SideBar = () => {
  const location = useLocation();

  const primaryNav = [
    { title: "Dashboard", path: "/", icons: <LayoutDashboard className="h-5 w-5" /> },
    { title: "User Management", path: "/user", icons: <Users className="h-5 w-5" /> },
  ];

  const administrationNav = [
    { title: "IELTS", path: "/ielts", icons: <GraduationCap className="h-5 w-5" /> },
    { title: "IELTS-MOCK-QNS", path: "/mock-tests", icons: <GraduationCap className="h-5 w-5" /> },
    { title: "Teachers", path: "/teachers", icons: <GraduationCap className="h-5 w-5" /> },
    { title: "Students", path: "/students", icons: <BookOpen className="h-5 w-5" /> },
    { title: "Counsellors", path: "/counsellors", icons: <UserCheck className="h-5 w-5" /> },
    { title: "Settings", path: "/settings", icons: <Settings className="h-5 w-5" /> },
    { title: "Student Ielts", path: "/studentIelts", icons: <IoIosPeople className="h-5 w-5" />},

  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Brand Logo Header Wrapper */}
      <div className="flex h-16 items-center border-b border-slate-100 px-6 bg-brand-primary">
        <Link to="/" className="flex items-center gap-2 font-medium text-xl text-white tracking-tight font-aeonik">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand text-base hover:scale-110 duration-500 ease-in-out">
            I
          </span>
          IELTS<span className="text-white">Prep</span>
        </Link>
      </div>

      {/* Main Sidebar Navigation lists */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
        <div className="flex flex-col gap-1">
          <div className="px-4  page-subtitle font-semibold uppercase tracking-wider text-brand mb-2">
            Main Menu
          </div>
          {primaryNav.map((val, i) => {
            const isActive = location.pathname === val.path;
            return (
              <Link
                key={i}
                to={val.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-md font-aeonik font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md shadow-slate-900/10"
                    : "text-slate-700 hover:bg-brand-light/30 hover:text-slate-900"
                }`}
              >
                <div className="py-1">{val.icons}</div>
                <div>{val.title}</div>
              </Link>
            );
          })}
        </div>

        <div className="flex flex-col gap-1">
          <div className="px-4 page-subtitle font-semibold uppercase tracking-wider text-brand mb-2">
            Management
          </div>
          {administrationNav.map((val, i) => {
            const isActive = location.pathname === val.path;
            return (
              <Link
                key={i}
                to={val.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-md font-aeonik font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-primary text-white shadow-md shadow-slate-900/10"
                    : "text-slate-700 hover:bg-brand-light/30 hover:text-slate-900"
                }`}
              >
                <div className="py-1">{val.icons}</div>
                <div>{val.title}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Status/Profile Indicator Foot */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <div className="flex items-center gap-3 px-2 page-subtitle">
          <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700 text-sm">
            SA
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-semibold text-slate-800 truncate">Super Admin</span>
            <span className="text-xs text-slate-500 truncate">admin@ielts.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;