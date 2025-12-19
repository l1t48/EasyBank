export default function AdminPendingTransactionsMobileCards({ tx, loadingRow, handleApprove, handleReject }) {
  const isActionable = tx.state === "Pending";

  return (
    <div
      key={tx.id}
      className="rounded shadow border text-base bg-[var(--nav-bg)] border-[var(--nav-text)] p-3 text-[var(--nav-text)]"
    >
      <div className="flex justify-start mb-1">
        <span className="font-bold">{tx.transactionId}</span>
      </div>
      <div className="flex justify-between mb-1 mt-5">
        <span className="font-semibold">User Bank Number:</span>
        <span>{tx.userAccountNumber || "-"}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">Target Account Number:</span>
        <span>{tx.targetAccountNumber || "-"}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">Type:</span>
        <span>{tx.transactionType}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">Amount:</span>
        <span>${Number(tx.amount).toFixed(2)}</span>
      </div>
      <div className="flex justify-between mb-1">
        <span className="font-semibold">State:</span>
        <span>{tx.state}</span>
      </div>
      <div className="flex justify-between mt-3">
        <span className="font-semibold">Created:</span>
        <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="flex justify-end gap-3 mt-3">
        {isActionable ? (
          <>
            <button
              onClick={() => handleApprove(tx.id)}
              disabled={loadingRow.approve || loadingRow.reject}
              className={`px-3 py-1 text-xs font-bold rounded border border-[--bg] ${loadingRow.approve ? "opacity-60 cursor-wait" : "bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)]"}`}
            >
              {loadingRow.approve ? "Approving..." : "Approve"}
            </button>
            <button
              onClick={() => handleReject(tx.id)}
              disabled={loadingRow.approve || loadingRow.reject}
              className={`px-3 py-1 text-xs font-bold rounded border ${loadingRow.reject ? "opacity-60 cursor-wait" : "border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)]"}`}
            >
              {loadingRow.reject ? "Rejecting..." : "Reject"}
            </button>
          </>
        ) : (
          <span className="px-3 py-1 text-sm font-bold rounded border border-[var(--danger-disabled-border)] text-[var(--danger-disabled-text)] bg-[var(--danger-disabled-bg)] cursor-not-allowed">
            {tx.state}
          </span>
        )}
      </div>
    </div>
  );
}