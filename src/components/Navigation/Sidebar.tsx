import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Settings, 
  UserCheck, 
  LayoutGrid,
  GraduationCap,
  ChevronLeft,
  Menu
} from "lucide-react";

// 1. Define the interface for individual navigation items
interface NavItem {
  title: string;
  path: string;
  icons: React.ReactNode;
}

// 2. Define the props interface for the sub-component
interface SidebarLinkProps {
  item: NavItem;
}

const SideBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // TypeScript now infers these arrays as NavItem[]
  const primaryNav: NavItem[] = [
    { title: "Dashboard", path: "/", icons: <LayoutDashboard className="h-5 w-5" /> },
    { title: "User Management", path: "/user", icons: <Users className="h-5 w-5" /> },
  ];

  const administrationNav: NavItem[] = [
    { title: "Courses", path: "/courses/categories", icons: <LayoutGrid className="h-5 w-5" /> },
    { title: "IELTS", path: "/ielts", icons: <GraduationCap className="h-5 w-5" /> },
    { title: "Teachers", path: "/teachers", icons: <GraduationCap className="h-5 w-5" /> },
    { title: "Students", path: "/students", icons: <BookOpen className="h-5 w-5" /> },
    { title: "Counsellors", path: "/counsellors", icons: <UserCheck className="h-5 w-5" /> },
    { title: "Settings", path: "/settings", icons: <Settings className="h-5 w-5" /> },
  ];

  // 3. Explicitly type the props parameter here
  const SidebarLink = ({ item }: SidebarLinkProps) => {
    const isActive = item.path === "/" 
      ? location.pathname === "/" 
      : location.pathname.startsWith(item.path);

    return (
      <Link
        to={item.path}
        title={!isOpen ? item.title : undefined}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-aeonik font-medium transition-all duration-200 ${
          isOpen ? "justify-start" : "justify-center px-0 h-11 w-11 mx-auto"
        } ${
          isActive
            ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/20"
            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <div className="flex items-center justify-center shrink-0">{item.icons}</div>
        {isOpen && <span className="transition-opacity duration-200">{item.title}</span>}
      </Link>
    );
  };

  return (
    <aside 
      className={`fixed inset-y-0 left-0 z-20 flex h-screen flex-col border-r border-slate-200 bg-white shadow-sm transition-all duration-300 ${
        isOpen ? "w-64" : "w-[72px]"
      }`}
    >
      {/* Brand Logo Header Wrapper */}
      <div className="flex h-16 items-center justify-between border-b border-slate-100 px-4 bg-brand-primary transition-all duration-300">
        <Link to="/" className="flex items-center gap-2.5 font-medium text-xl text-white tracking-tight font-aeonik group overflow-hidden">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-brand text-base font-bold transition-transform duration-300 group-hover:scale-105">
            I
          </span>
          {isOpen && (
            <span className="animate-fade-in whitespace-nowrap">
              IELTS<span className="opacity-90 font-light">Prep</span>
            </span>
          )}
        </Link>

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-white hover:bg-white/10 transition-all ${
            !isOpen ? "mx-auto" : ""
          }`}
        >
          {isOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Main Sidebar Navigation lists */}
      <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-3 custom-scrollbar">
        {/* Main Menu Section */}
        <div className="flex flex-col gap-1">
          {isOpen ? (
            <div className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 whitespace-nowrap">
              Main Menu
            </div>
          ) : (
            <hr className="border-slate-100 my-2 mx-2" />
          )}
          {primaryNav.map((item, i) => (
            <SidebarLink key={`primary-${i}`} item={item} />
          ))}
        </div>

        {/* Management Section */}
        <div className="flex flex-col gap-1">
          {isOpen ? (
            <div className="px-4 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2 whitespace-nowrap">
              Management
            </div>
          ) : (
            <hr className="border-slate-100 my-2 mx-2" />
          )}
          {administrationNav.map((item, i) => (
            <SidebarLink key={`admin-${i}`} item={item} />
          ))}
        </div>
      </div>

      {/* User Status/Profile Indicator Foot */}
      <div className="border-t border-slate-100 p-4 bg-slate-50/50">
        <div className={`flex items-center gap-3 ${isOpen ? "px-2" : "justify-center px-0"}`}>
          <div className="h-9 w-9 rounded-full bg-brand-light/20 flex items-center justify-center font-bold text-brand-primary text-sm shadow-inner shrink-0">
            SA
          </div>
          {isOpen && (
            <div className="flex flex-col min-w-0 transition-opacity duration-200">
              <span className="text-sm font-semibold text-slate-800 truncate">Super Admin</span>
              <span className="text-xs text-slate-400 truncate font-light">admin@ielts.com</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default SideBar;