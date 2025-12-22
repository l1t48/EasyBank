import { useState, useRef, useEffect } from "react";
import { useAuditLogsData } from "../../../Hooks/Admin-Hooks/useAdminAuditLogsData";
import { downloadJSON } from "../../../Utils/Admin-Utils/AdminAuditLogsExportUtils";
import AdminAuditLogsFilteringOptions from "./AdminAuditLogsFilteringOptions";
import AdminAuditLogsMobileCards from "./AdminAuditLogsMobileCards";
import AdminAuditLogsTable from "./AdminAuditLogsTable";
import { TABLE_COLUMN_COUNT } from "../../../Data/Global_variables";

function AdminAuditLogsEntity() {
  const { logs, loading, error, expandedId, toggleExpandedId, fetchLogs } = useAuditLogsData();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyFilters = (filters) => {
    fetchLogs(filters);
    setIsFilterModalOpen(false);
  };

  const handleExport = () => {
    downloadJSON(logs);
    setDropdownOpen(false);
  };

  const handleRefresh = () => {
    fetchLogs({});
    setDropdownOpen(false);
  };

  return (
    <div className="mt-5 w-full px-2 sm:px-4">
      <AdminAuditLogsFilteringOptions
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-[var(--nav-text)] duration-300 transition-colors">Audit Logs</h2>
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] shadow-md transition"
            >
              <span className="sr-only">Menu</span>
              <span className="text-xl select-none">⋯</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-1 w-44 rounded shadow-md p-2 bg-[var(--nav-bg)] border border-[var(--nav-text)] z-50">
                <button
                  onClick={handleRefresh}
                  className="block w-full text-left px-2 py-1 font-bold rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] mb-1"
                >
                  Refresh
                </button>
                <button
                  onClick={() => { setIsFilterModalOpen(true); setDropdownOpen(false); }}
                  className="block w-full text-left px-2 py-1 font-bold rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] mt-2"
                >
                  Filtering Options
                </button>
                <button
                  onClick={handleExport}
                  className="block w-full text-left px-2 py-1 font-bold rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] mt-2"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && <p className="text-center text-[var(--nav-text)] mt-5">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="space-y-3 xl:hidden mt-10">
        {logs.length === 0 && !loading ? (
          <p className="text-center text-[var(--nav-text)]">No system logs available.</p>
        ) : (
          logs.map(log => (
            <AdminAuditLogsMobileCards
              key={log._id || log.id || Math.random()}
              log={log}
              expandedId={expandedId}
              toggleExpandedId={toggleExpandedId}
            />
          ))
        )}
      </div>

      <div className="hidden xl:block mt-10">
        <div className="p-2 rounded border bg-[var(--nav-bg)] border-[var(--nav-text)]">
          <table className="min-w-full table-auto font-bold text-sm text-[var(--nav-text)] text-center">
            <thead>
              <tr>
                {['Time', 'Action', 'User', 'Account#', 'Message', 'Details'].map(h => (
                  <th key={h} className="duration-300 transition-colors p-2 text-xl border-b border-[var(--nav-text)] text-center">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && !loading ? (
                <tr><td colSpan={TABLE_COLUMN_COUNT} className="p-3 text-center text-sm md:text-base bg-[var(--bg)]">No system logs available.</td></tr>
              ) : (
                logs.map(log => (
                  <AdminAuditLogsTable
                    key={log._id || log.id || Math.random()}
                    log={log}
                    expandedId={expandedId}
                    toggleExpandedId={toggleExpandedId}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAuditLogsEntity;