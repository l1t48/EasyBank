import { AMOUNT_DECIMAL_PLACES } from "../../../Data/Global_variables";

function AdminAllTransactionsTable({ tx, dropdownOpen, toggleDropdown, dropdownRef, loadingRow, handleApprove, handleReject }) {
  const isActionable = tx.state === "Pending";
  return (
    <tr key={tx.id} className="bg-[var(--nav-bg)] text-center">
      <td
        ref={dropdownOpen === tx.id ? dropdownRef : null}
        className="duration-300 transition-colors p-2 border border-[var(--nav-text)] cursor-pointer underline relative"
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
      <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{tx.userAccountNumber || "-"}</td>
      <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{tx.targetAccountNumber || "-"}</td>
      <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{tx.transactionType}</td>
      <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">${Number(tx.amount).toFixed(AMOUNT_DECIMAL_PLACES)}</td>
      <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{tx.state}</td>
      <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{new Date(tx.createdAt).toLocaleDateString()}</td>
    </tr>
  );
}

export default AdminAllTransactionsTable;