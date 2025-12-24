import { useEffect, useState, useRef, useId } from "react";

function AdminTransactionsFilteringOptions({ isOpen, onClose, onApplyFilters }) {
  const [transactionId, setTransactionId] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const idPrefix = useId();
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyFilters = (e) => {
    e.preventDefault();
    setError(null);
    if ((startDate && !endDate) || (!startDate && endDate)) {
      setError("Please provide both a Start Date and an End Date for the time interval.");
      return;
    }
    if ((minAmount && !maxAmount) || (!minAmount && maxAmount)) {
      setError("Please provide both a Minimum and Maximum Amount for the amount interval.");
      return;
    }
    if (minAmount && maxAmount && Number(minAmount) > Number(maxAmount)) {
      setError("Minimum amount cannot be greater than Maximum amount.");
      return;
    }
    const filters = {
      accountNumber: accountNumber || undefined,
      transactionId: transactionId.trim(),
      state: status || undefined,
      transactionType: type || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined,
    };
    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v));
    onApplyFilters(cleanFilters);
    onClose();
  };

  const handleResetFilters = () => {
    setAccountNumber("");
    setTransactionId("");
    setStatus("");
    setType("");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
    setError(null);
    onApplyFilters({});
  };

  const handleBackdropClick = (e) => {
    if (overlayRef.current && e.target === overlayRef.current) {
      onClose();
    }
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
        className="
          bg-[var(--nav-bg)] rounded-xl shadow-lg w-full
          max-w-xl md:max-w-2xl lg:max-w-3xl
          mt-6 mb-6
          max-h-[90vh] overflow-hidden flex flex-col
          ring-1 ring-black/10
        "
      >
        <div className="flex items-start justify-between p-4 border-b border-[var(--nav-text)]/10">
          <div>
            <h2 id="filter-modal-title" className="text-lg md:text-2xl font-bold text-[var(--nav-text)]">
              Filtering Options
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close filters"
            className="ml-4 rounded p-2 hover:bg-[var(--nav-text)]/10 text-[var(--nav-text)]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleApplyFilters} className="p-4 overflow-y-auto" style={{ flex: 1 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">

            <div className="col-span-1 lg:col-span-1">
              <label htmlFor={`${idPrefix}-transactionID`} className="block text-[var(--nav-text)] text-sm mb-1">Transaction ID (Optional)</label>
              <input
                type="text"
                id={`${idPrefix}-transactionID`}
                name="transactionID"
                placeholder="e.g., TXN-"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="p-2 w-full border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              />
            </div>
            <div className="col-span-1 lg:col-span-1">
              <label htmlFor={`${idPrefix}-accountNumber`} className="block text-[var(--nav-text)] text-sm mb-1">Account Number (Optional)</label>
              <input
                type="text"
                id={`${idPrefix}-accountNumber`}
                name="accountNumber"
                placeholder="e.g., 60c72b9..."
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="p-2 w-full border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              />
            </div>
            <div>
              <label htmlFor={`${idPrefix}-status`} className="block text-[var(--nav-text)] text-sm mb-1">Status</label>
              <select
                id={`${idPrefix}-status`}
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="p-2 w-full border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            <div>
              <label htmlFor={`${idPrefix}-type`} className="block text-[var(--nav-text)] text-sm mb-1">Type</label>
              <select
                value={type}
                id={`${idPrefix}-type`}
                name="type"
                onChange={(e) => setType(e.target.value)}
                className="p-2 w-full border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              >
                <option value="">All Types</option>
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>
            <fieldset className="col-span-1 sm:col-span-2 lg:col-span-2 border border-[var(--nav-text)] p-3 rounded-md">
              <legend className="text-[var(--nav-text)] font-semibold px-1">Time Interval</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label htmlFor={`${idPrefix}-fromDate`} className="text-[var(--nav-text)] text-sm block mb-1">From Date</label>
                  <input
                    type="date"
                    id={`${idPrefix}-fromDate`}
                    name="fromDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 w-full border rounded bg-[var(--nav-bg)] text-[var(--nav-hover)] outline-none focus:ring focus:ring-[var(--nav-hover)]"
                  />
                </div>
                <div>
                  <label htmlFor={`${idPrefix}-toDate`} className="text-[var(--nav-text)] text-sm block mb-1">To Date</label>
                  <input
                    type="date"
                    id={`${idPrefix}-toDate`}
                    name="toDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 w-full border rounded bg-[var(--nav-bg)] text-[var(--nav-hover)] outline-none focus:ring focus:ring-[var(--nav-hover)]"
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="col-span-1 sm:col-span-2 lg:col-span-1 border border-[var(--nav-text)] p-3 rounded-md">
              <legend className="text-[var(--nav-text)] font-semibold px-1">Amount Interval</legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div>
                  <label htmlFor={`${idPrefix}-minAmount`} className="text-[var(--nav-text)] text-sm block mb-1">Min Amount</label>
                  <input
                    type="number"
                    id={`${idPrefix}-minAmount`}
                    name="minAmount"
                    placeholder="Min"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="p-2 w-full border rounded bg-[var(--nav-bg)] text-[var(--nav-hover)] outline-none focus:ring focus:ring-[var(--nav-hover)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label htmlFor={`${idPrefix}-maxAmount`} className="text-[var(--nav-text)] text-sm block mb-1">Max Amount</label>
                  <input
                    id={`${idPrefix}-maxAmount`}
                    name="maxAmount"
                    type="number"
                    placeholder="Max"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="p-2 w-full border rounded bg-[var(--nav-bg)] text-[var(--nav-hover)] outline-none focus:ring focus:ring-[var(--nav-hover)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </fieldset>
          </div>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </form>

        <div className="border-t border-[var(--nav-text)]/10 p-3 bg-gradient-to-t from-[var(--nav-bg)] to-transparent">
          <div className="max-w-full mx-auto px-2 flex flex-col sm:flex-row gap-3">
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
              onClick={(e) => handleApplyFilters(e)}
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

export default AdminTransactionsFilteringOptions;
