import { useEffect, useState, useRef, useId } from "react";
import { LOG_LIMIT, LOG_LIMIT_phase_2, LOG_LIMIT_phase_3, LOG_LIMIT_phase_4 } from "../../../Data/Global_variables";

function SupervisorAuditLogsFilteringOptions({ isOpen, onClose, onApplyFilters }) {
  const [accountNumber, setAccountNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [role, setRole] = useState("");
  const [limit, setLimit] = useState(LOG_LIMIT);
  const idPrefix = useId();

  const [error, setError] = useState(null);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setError(null);

    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError("Please provide both a Start Date and an End Date.");
      return;
    }

    const filters = {
      accountNumber: accountNumber || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      role: role || undefined,
      limit: limit || undefined,
    };

    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v)
    );

    onApplyFilters(cleanFilters);
    onClose();
  };

  const handleResetFilters = () => {
    setAccountNumber("");
    setStartDate("");
    setEndDate("");
    setRole("");
    setLimit(LOG_LIMIT);
    setError(null);
    onApplyFilters({});
  };

  const handleBackdropClick = (e) => {
    if (overlayRef.current && e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto animate__animated animate__fadeIn"
      aria-modal="true"
      role="dialog"
      aria-labelledby="filter-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-[var(--nav-bg)] rounded-xl shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-3xl mt-6 mb-6 max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-black/10"
      >
        <div className="flex items-start justify-between p-4 border-b border-[var(--nav-text)]/10">
          <h2 id="filter-modal-title" className="text-lg md:text-2xl font-bold text-[var(--nav-text)]">
            Filtering Options
          </h2>
          <button onClick={onClose} aria-label="Close filters" className="ml-4 rounded p-2 hover:bg-[var(--nav-text)]/10 text-[var(--nav-text)]">✕</button>
        </div>

        <form onSubmit={handleApplyFilters} className="p-4 overflow-y-auto" style={{ flex: 1 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            <div>
              <label htmlFor={`${idPrefix}-accountNumber`} className="block text-[var(--nav-text)] text-sm mb-1">Account Number</label>
              <input
                type="text"
                id={`${idPrefix}-accountNumber`}
                name={`${idPrefix}-accountNumber`}
                placeholder="e.g., 60c72b9..."
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="p-2 w-full border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              />
            </div>

            <div>
              <label htmlFor={`${idPrefix}-role`} className="block text-[var(--nav-text)] text-sm mb-1">Role</label>
              <select
                value={role}
                id={`${idPrefix}-role`}
                name={`${idPrefix}-role`}
                onChange={(e) => setRole(e.target.value)}
                className="p-2 w-full border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              >
                <option value="">All Roles</option>
                <option value="User">User</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>

            <div>
              <label htmlFor={`${idPrefix}-fromDate`} className="block text-[var(--nav-text)] text-sm mb-1">From Date</label>
              <input
                type="date"
                id={`${idPrefix}-fromDate`}
                name={`${idPrefix}-fromDate`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 w-full border rounded bg-[var(--nav-bg)] text-[var(--nav-hover)] outline-none focus:ring focus:ring-[var(--nav-hover)]"
              />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-toDate`} className="block text-[var(--nav-text)] text-sm mb-1">To Date</label>
              <input
                type="date"
                id={`${idPrefix}-toDate`}
                name={`${idPrefix}-toDate`}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 w-full border rounded bg-[var(--nav-bg)] text-[var(--nav-hover)] outline-none focus:ring focus:ring-[var(--nav-hover)]"
              />
            </div>

            <div>
              <label htmlFor={`${idPrefix}-limit`} className="block text-[var(--nav-text)] text-sm mb-1">Limit</label>
              <select
                id={`${idPrefix}-limit`}
                name={`${idPrefix}-limit`}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="p-2 w-full border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              >
                <option value={LOG_LIMIT}>50</option>
                <option value={LOG_LIMIT_phase_2}>100</option>
                <option value={LOG_LIMIT_phase_3}>200</option>
                <option value={LOG_LIMIT_phase_4}>500</option>
              </select>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        <div className="border-t border-[var(--nav-text)]/10 p-3 bg-gradient-to-t from-[var(--nav-bg)] to-transparent">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleResetFilters}
              className="w-full sm:w-1/3 font-semibold py-2 rounded-md border border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] transition-all duration-300"
            >
              Reset Filters
            </button>
            <div className="flex-1" />
            <button
              type="button"
              onClick={handleApplyFilters}
              className="w-full sm:w-1/3 font-semibold py-2 rounded-md bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupervisorAuditLogsFilteringOptions;
