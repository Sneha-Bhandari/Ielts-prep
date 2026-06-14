// Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "../components/Navigation/Header";
import SideBar from "../components/Navigation/Sidebar";

const Layout = () => {
  return (
    <div className="h-screen w-full bg-[#FAF9F6] text-slate-900 antialiased overflow-hidden">
      <SideBar />

      <div className="pl-64 flex flex-col h-full">
        <Header />

        <main className="relative bg-white flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;