// Layout.tsx
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Navigation/Header";
import SideBar from "../components/Navigation/Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="h-screen w-full bg-[#FAF9F6] overflow-hidden">
      <SideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Main content wrapper */}
      <div className="h-full flex flex-col">
        {/* Header - full width */}
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          isMobile={isMobile} 
        />
        
        {/* Main content area with proper margins based on sidebar state */}
        <main 
          className="flex-1 overflow-y-auto  w-full pl-16 mx-auto"
          style={{
            marginLeft: isMobile ? 0 : (isSidebarOpen ? '16rem' : '5rem'),
            transition: 'margin-left 0.3s ease-in-out'
          }}
        >
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;