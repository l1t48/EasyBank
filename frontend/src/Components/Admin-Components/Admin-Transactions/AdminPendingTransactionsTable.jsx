import { useRef, useEffect } from 'react';

/**
 * Desktop-specific table display for pending transactions with sorting and actions.
 */
export default function AdminPendingTransactionsTable({
  transactions,
  actionLoading,
  sortBy,
  order,
  handleSort,
  handleApprove,
  handleReject,
  dropdownOpen,
  toggleDropdown,
}) {
  const dropdownRef = useRef(null);
  
  // Note: dropdown outside click logic is now handled inside Pending_transactions_admin 
  // and passed down via dropdownRef/dropdownOpen

  // Columns to display
  const columns = [
    "transactionId",
    "userAccountNumber",
    "targetAccountNumber",
    "transactionType",
    "amount",
    "state",
    "createdAt"
  ];

  // Helper to format column headers
  const formatColumnHeader = (col) => col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

  // Use useEffect to manage the dropdownRef on the currently open row
  useEffect(() => {
    // This is a subtle point: The ref for closing outside the dropdown must be placed on the element
    // containing the entire dropdown logic. In this case, it's on the cell of the active row.
    // The parent component is responsible for setting the ref via the ternary operator on the <td>.
  }, [dropdownOpen]);


  if (transactions.length === 0) {
    return (
      <div className="p-5">
        <table className="min-w-full table-auto font-bold border text-[var(--nav-text)] border-[var(--nav-text)] text-sm md:text-base">
          <thead className="bg-[var(--nav-bg)]"><tr>{columns.map(col => <th key={col} className="p-2 border border-[var(--nav-text)]">{formatColumnHeader(col)}</th>)}</tr></thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="p-3 border text-center border-[var(--nav-text)]">
                No pending transactions.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="p-5 overflow-x-auto">
      <table className="min-w-full table-auto font-bold border text-[var(--nav-text)] border-[var(--nav-text)] text-sm md:text-base">
        <thead className="bg-[var(--nav-bg)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="p-2 border border-[var(--nav-text)] cursor-pointer"
                onClick={() => handleSort(col)}
              >
                {formatColumnHeader(col)}
                {sortBy === col ? (order === "asc" ? " ↑" : " ↓") : ""}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {transactions.map((tx) => {
            const loadingRow = actionLoading[tx.id] || {};
            const isActionable = tx.state === "Pending";
            
            // Define the reference based on which row is open
            const currentRef = dropdownOpen === tx.id ? dropdownRef : null;

            return (
              <tr key={tx.id} className="bg-[var(--nav-bg)] text-center">
                <td
                  ref={currentRef} // Pass the ref here
                  className="p-2 border border-[var(--nav-text)] cursor-pointer underline relative"
                  onClick={() => toggleDropdown(tx.id)}
                >
                  {tx.transactionId}
                  {dropdownOpen === tx.id && (
                    <div className="absolute bg-[var(--nav-bg)] shadow-md p-2 mt-1 rounded z-50 w-40 border border-[var(--nav-text)]" style={{ left: "50%", transform: "translateX(-50%)" }}>
                      {isActionable ? (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleApprove(tx.id); }}
                            disabled={loadingRow.approve || loadingRow.reject}
                            className={`block w-full text-left px-2 py-1 rounded text-sm font-bold border ${loadingRow.approve ? "opacity-60 cursor-wait" : "bg-[var(--nav-text)] text-[var(--nav-bg)] border border-[--bg] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)]"}`}
                          >
                            {loadingRow.approve ? "Approving..." : "Approve"}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleReject(tx.id); }}
                            disabled={loadingRow.approve || loadingRow.reject}
                            className={`block w-full text-left px-2 py-1 rounded text-sm mt-1 font-bold border ${loadingRow.reject ? "opacity-60 cursor-wait" : "border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)]"}`}
                          >
                            {loadingRow.reject ? "Rejecting..." : "Reject"}
                          </button>
                        </>
                      ) : (
                        <span className="block w-full font-bold text-center px-2 py-1 rounded text-sm mt-1 border border-[var(--danger-disabled-border)] text-[var(--danger-disabled-text)] bg-[var(--danger-disabled-bg)] cursor-not-allowed">
                          {tx.state}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-2 border border-[var(--nav-text)]">{tx.userAccountNumber || "-"}</td>
                <td className="p-2 border border-[var(--nav-text)]">{tx.targetAccountNumber || "-"}</td>
                <td className="p-2 border border-[var(--nav-text)]">{tx.transactionType}</td>
                <td className="p-2 border border-[var(--nav-text)]">${Number(tx.amount).toFixed(2)}</td>
                <td className="p-2 border border-[var(--nav-text)]">{tx.state}</td>
                <td className="p-2 border border-[var(--nav-text)]">{new Date(tx.createdAt).toLocaleDateString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}