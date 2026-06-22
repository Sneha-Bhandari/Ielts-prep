import React, { useState, useRef, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  currentItems?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const startItem = (currentPage - 1) * (itemsPerPage || 10) + 1;
  const endItem = Math.min(currentPage * (itemsPerPage || 10), totalItems || 0);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-5 px-2 sm:px-0">
      {totalItems && (
        <div className="text-sm text-slate-500 order-2 sm:order-1">
          Showing <span className="font-medium text-slate-700">{startItem}</span> to{" "}
          <span className="font-medium text-slate-700">{endItem}</span> of{" "}
          <span className="font-medium text-slate-700">{totalItems}</span> results
        </div>
      )}

      <div className="flex items-center gap-3 order-1 sm:order-2">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-white/80 backdrop-blur-sm border border-[#04413D]/20 text-[#04413D] px-3 py-1.5 rounded-xl shadow-sm hover:bg-teal-50 focus:outline-none flex items-center gap-2 transition cursor-pointer text-sm"
          >
            <span className="font-medium">Page {currentPage}</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {dropdownOpen && (
            <ul className="absolute left-0 mt-1 w-full bg-white/90 backdrop-blur-sm border border-brand rounded-xl shadow-lg max-h-48 overflow-auto z-50 min-w-full">
              {pageOptions.map((p) => (
                <li
                  key={p}
                  onClick={() => {
                    onPageChange(p);
                    setDropdownOpen(false);
                  }}
                  className={`px-3 py-2  cursor-pointer text-sm transition rounded-lg ${
                    p === currentPage
                      ? "bg-Linear-to-r from-brand to-brand-light text-black font-medium"
                      : "hover:bg-teal-50 hover:text-brand text-brand-primary"
                  }`}
                >
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
              currentPage === 1
                ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-400 border border-gray-200"
                : "bg-linear-to-r from-brand to-brand-light text-black hover:brightness-110 shadow-md cursor-pointer"
            }`}
          >
            &laquo; Prev
          </button>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${
              currentPage === totalPages
                ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-900 border border-gray-200"
                : "bg-linear-to-r from-brand to-brand-light text-black hover:brightness-110 shadow-md cursor-pointer"
            }`}
          >
            Next &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;