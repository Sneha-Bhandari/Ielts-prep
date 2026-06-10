// Header.tsx
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white flex h-16 w-full items-center justify-between border-b border-slate-200 px-6 sm:px-8 shadow-sm">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search documents, students, mock tests..."
            className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2 text-sm bg-slate-50/50 placeholder-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;