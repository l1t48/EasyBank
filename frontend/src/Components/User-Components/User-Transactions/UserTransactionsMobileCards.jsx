import { handleCancel } from '../../../Utils/User-Utils/UserTransactionsCancelUtils';
import { AMOUNT_DECIMAL_PLACES } from '../../../Data/Global_variables';

function UserTransactionsMobileCards({ transactions, fetchTx }) {
  return (
    <div className="xl:hidden space-y-3">
            {transactions.length === 0 ? (
        <p className="text-center text-[var(--nav-text)]">No pending transactions.</p>
      ) : (
      transactions.map((tx) => {
        const canCancel = !["Approved", "Rejected", "Canceled"].includes(tx.state);
        return (
          <div
            key={tx.id}
            className="rounded shadow border text-base bg-[var(--nav-bg)] border-[var(--nav-text)] p-3 text-[var(--nav-text)]"
          >
            <div className="flex justify-start mb-1 duration-300 transition-colors">
              <span className="font-bold">{tx.transactionId}</span>
            </div>
            <div className="flex justify-between mb-1 mt-5 duration-300 transition-colors">
              <span className="font-semibold">User Bank Number:</span>
              <span>{tx.userAccountNumber || "-"}</span>
            </div>
            <div className="flex justify-between mb-1 duration-300 transition-colors">
              <span className="font-semibold">Target Account Number:</span>
              <span>{tx.targetAccountNumber || "-"}</span>
            </div>
            <div className="flex justify-between mb-1 duration-300 transition-colors">
              <span className="font-semibold">Type:</span>
              <span>{tx.transactionType}</span>
            </div>
            <div className="flex justify-between mb-1 duration-300 transition-colors">
              <span className="font-semibold">Amount:</span>
              <span>${tx.amount.toFixed(AMOUNT_DECIMAL_PLACES)}</span>
            </div>
            <div className="flex justify-between mb-1 duration-300 transition-colors">
              <span className="font-semibold">State:</span>
              <span>{tx.state}</span>
            </div>
            <div className="flex justify-between mt-3 duration-300 transition-colors">
              <span className="font-semibold">Created:</span>
              <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              {canCancel ? (
                <button
                  onClick={() => handleCancel(tx.id, fetchTx)}
                  className="px-3 py-1 text-xs font-bold rounded border border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] duration-300 transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <span className="px-3 py-1 text-sm font-bold rounded border border-[var(--danger-disabled-border)] text-[var(--danger-disabled-text)] bg-[var(--danger-disabled-bg)] cursor-not-allowed">
                  {tx.state}
                </span>
              )}
            </div>
          </div>
        );
      })
    )}
    </div>
  );
}

export default UserTransactionsMobileCards;