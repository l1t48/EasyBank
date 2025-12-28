import { useState, useRef, useEffect } from "react";
import { usePendingTransactions } from "../../../Hooks/Supervisor-Hooks/useSupervisorPendingTransactions";
import { handleApprove, handleReject } from "../../../Utils/Supervisor-Utils/SupervisorTransactionsOperations";
import { AMOUNT_DECIMAL_PLACES, TABLE_COLUMN_COUNT_PENDING_TRANSACTIONS_SUPERVISOR } from "../../../Data/Global_variables";

function SupervisorTransactionsEntity({ filters }) {
  const {
    transactions,
    loading,
    actionLoading,
    sortBy,
    order,
    handleSort,
    setRowLoading,
    removeTransaction,
  } = usePendingTransactions(filters);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = (id) => setDropdownOpen(dropdownOpen === id ? null : id);
  const onApprove = (id) => handleApprove(id, setRowLoading, removeTransaction);
  const onReject = (id) => handleReject(id, setRowLoading, removeTransaction);

  if (loading) return <p className="text-center text-[var(--nav-text)] mt-5">Loading...</p>;

  const MobileView = () => (
    <div className="xl:hidden space-y-3">
      {transactions.length === 0 ? (
        <p className="text-center text-[var(--nav-text)]">No pending transactions.</p>
      ) : (
        transactions.map((tx) => {
          const loadingRow = actionLoading[tx.id] || {};
          const isActionable = tx.state === "Pending";
          return (
            <div key={tx.id} className="rounded shadow border text-base bg-[var(--nav-bg)] border-[var(--nav-text)] p-3 text-[var(--nav-text)]">
              <div className="flex justify-start mb-1">
                <span className="font-bold duration-300 transition-colors">{tx.transactionId}</span>
              </div>
              <div className="flex justify-between mb-1 mt-5 duration-300 transition-colors"><span className="font-semibold">User Bank Number:</span><span>{tx.userAccountNumber || "-"}</span></div>
              <div className="flex justify-between mb-1 duration-300 transition-colors"><span className="font-semibold">Target Account Number:</span><span>{tx.targetAccountNumber || "-"}</span></div>
              <div className="flex justify-between mb-1 duration-300 transition-colors"><span className="font-semibold">Type:</span><span>{tx.transactionType}</span></div>
              <div className="flex justify-between mb-1 duration-300 transition-colors"><span className="font-semibold">Amount:</span><span>${Number(tx.amount).toFixed(AMOUNT_DECIMAL_PLACES)}</span></div>
              <div className="flex justify-between mb-1 duration-300 transition-colors"><span className="font-semibold">State:</span><span>{tx.state}</span></div>
              <div className="flex justify-between mt-3 duration-300 transition-colors"><span className="font-semibold">Created:</span><span>{new Date(tx.createdAt).toLocaleDateString()}</span></div>
              <div className="flex justify-end gap-3 mt-3 duration-300 transition-colors">
                {isActionable ? (
                  <>
                    <button onClick={() => onApprove(tx.id)} disabled={loadingRow.approve || loadingRow.reject} className={`px-3 py-1 text-xs font-bold rounded border border-[--bg] ${loadingRow.approve ? "opacity-60 cursor-wait" : "bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)] duration-300 transition-colors"}`}>
                      {loadingRow.approve ? "Approving..." : "Approve"}
                    </button>
                    <button onClick={() => onReject(tx.id)} disabled={loadingRow.approve || loadingRow.reject} className={`px-3 py-1 text-xs font-bold rounded border ${loadingRow.reject ? "opacity-60 cursor-wait" : "border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] duration-300 transition-colors"}`}>
                      {loadingRow.reject ? "Rejecting..." : "Reject"}
                    </button>
                  </>
                ) : (
                  <span className="px-3 py-1 text-sm font-bold rounded border border-[var(--danger-disabled-border)] text-[var(--danger-disabled-text)] bg-[var(--danger-disabled-bg)] cursor-not-allowed">{tx.state}</span>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );

  const DesktopView = () => (
    <div className="hidden xl:block">
      <div className="p-5">
        <table className="min-w-full table-auto font-bold border text-[var(--nav-text)] border-[var(--nav-text)] text-sm md:text-base">
          <thead className="bg-[var(--nav-bg)]">
            <tr>
              {["transactionId", "userAccountNumber", "targetAccountNumber", "transactionType", "amount", "state", "createdAt"].map((col) => (
                <th
                  key={col}
                  className="p-2 border border-[var(--nav-text)] cursor-pointer"
                  onClick={() => handleSort(col)}
                >
                  {col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  {sortBy === col ? (order === "asc" ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMN_COUNT_PENDING_TRANSACTIONS_SUPERVISOR} className="p-3 border text-center border-[var(--nav-text)]">No pending transactions.</td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const loadingRow = actionLoading[tx.id] || {};
                const isActionable = tx.state === "Pending";
                return (
                  <tr key={tx.id} className="bg-[var(--nav-bg)] text-center">
                    <td ref={dropdownOpen === tx.id ? dropdownRef : null} className="p-2 border border-[var(--nav-text)] cursor-pointer underline relative" onClick={() => toggleDropdown(tx.id)}>
                      {tx.transactionId}
                      {dropdownOpen === tx.id && (
                        <div className="absolute bg-[var(--nav-bg)] shadow-md p-2 mt-1 rounded z-50 w-40 border border-[var(--nav-text)]" style={{ left: "50%", transform: "translateX(-50%)" }}>
                          {isActionable ? (
                            <>
                              <button onClick={(e) => { e.stopPropagation(); onApprove(tx.id); }} disabled={loadingRow.approve || loadingRow.reject} className={`block w-full text-left px-2 py-1 rounded text-sm font-bold border ${loadingRow.approve ? "opacity-60 cursor-wait" : "bg-[var(--nav-text)] text-[var(--nav-bg)] border border-[--bg] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)] duration-300 transition-colors"}`}>{loadingRow.approve ? "Approving..." : "Approve"}</button>
                              <button onClick={(e) => { e.stopPropagation(); onReject(tx.id); }} disabled={loadingRow.approve || loadingRow.reject} className={`block w-full text-left px-2 py-1 rounded text-sm mt-1 font-bold border ${loadingRow.reject ? "opacity-60 cursor-wait" : "border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] duration-300 transition-colors"}`}>{loadingRow.reject ? "Rejecting..." : "Reject"}</button>
                            </>
                          ) : (
                            <span className="block w-full font-bold text-center px-2 py-1 rounded text-sm mt-1 border border-[var(--danger-disabled-border)] text-[var(--danger-disabled-text)] bg-[var(--danger-disabled-bg)] cursor-not-allowed">{tx.state}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-2 border border-[var(--nav-text)]">{tx.userAccountNumber || "-"}</td>
                    <td className="p-2 border border-[var(--nav-text)]">{tx.targetAccountNumber || "-"}</td>
                    <td className="p-2 border border-[var(--nav-text)]">{tx.transactionType}</td>
                    <td className="p-2 border border-[var(--nav-text)]">${Number(tx.amount).toFixed(AMOUNT_DECIMAL_PLACES)}</td>
                    <td className="p-2 border border-[var(--nav-text)]">{tx.state}</td>
                    <td className="p-2 border border-[var(--nav-text)]">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-stretch px-4 sm:px-6 lg:px-8">
      <div className="mt-5 w-full px-2 sm:px-4">
        <MobileView />
        <DesktopView />
      </div>
    </div>
  );
}

export default SupervisorTransactionsEntity;