import { useEffect, useState, useRef } from "react";
import { useAuditLogs } from "../../../Hooks/Supervisor-Hooks/useSupervisorAuditLogs";
import { downloadJSON } from "../../../Utils/Supervisor-Utils/SupervisorAuditLogsExportUtils";
import SupervisorAuditLogsMobileCards from "./SupervisorAuditLogsMobileCards";
import SupervisorAuditLogsTable from "./SupervisorAuditLogsTable";
import SupervisorAuditLogsFilteringOptions from "./SupervisorAuditLogsFilteringOptions";

function SupervisorAuditLogsEntity() {
  const {
    logs,
    loading,
    error,
    fetchLogs,
    refreshLogs,
  } = useAuditLogs();
  const [expandedId, setExpandedId] = useState(null);
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
  }

  if (loading && logs.length === 0) {
    return <p className="text-center text-[var(--nav-text)] mt-5">Loading...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500 mt-5">Error: {error}</p>;
  }

  return (
    <div className="mt-5 w-full px-2 sm:px-4">
      <SupervisorAuditLogsFilteringOptions
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
                  onClick={() => { refreshLogs(); setDropdownOpen(false); }}
                  className="block w-full text-left px-2 py-1 font-bold rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] mb-1 duration-300 transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={() => { setIsFilterModalOpen(true); setDropdownOpen(false); }}
                  className="block w-full text-left px-2 py-1 font-bold rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] mt-2 duration-300 transition-colors"
                >
                  Filtering Options
                </button>
                <button
                  onClick={handleExport}
                  className="block w-full text-left px-2 py-1 font-bold rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] mt-2 duration-300 transition-colors"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-3 xl:hidden mt-10">
        {logs.length === 0 && !loading ? (
          <p className="text-center text-[var(--nav-text)]">No system logs available.</p>
        ) : (
          logs.map(log => (
            <SupervisorAuditLogsMobileCards
              key={log._id || log.id || Math.random()}
              log={log}
              expandedId={expandedId}
              setExpandedId={setExpandedId}
            />
          ))
        )}
      </div>
      <div className="hidden xl:block mt-10">
        <SupervisorAuditLogsTable
          logs={logs}
          loading={loading}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
        />
      </div>
    </div>
  );
}

export default SupervisorAuditLogsEntity;