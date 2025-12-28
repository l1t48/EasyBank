import { useState, useRef, useEffect } from 'react';
import { handleCancel } from '../../../Utils/User-Utils/UserTransactionsCancelUtils';
import { TABLE_COLUMN_COUNT_TRANSACTION_USER, AMOUNT_DECIMAL_PLACES } from '../../../Data/Global_variables';
const columnHeaders = {
  transactionId: "Transaction ID",
  userAccountNumber: "User Account Number",
  targetAccountNumber: "Target Account Number",
  transactionType: "Transaction Type",
  amount: "Amount",
  state: "State",
  createdAt: "Created At",
};

function UserTransactionsTable({ transactions, sortBy, order, handleSort, fetchTx }) {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(null);
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = (id) => setDropdownOpen(dropdownOpen === id ? null : id);

  return (
    <div className="hidden xl:block">
      <div className="p-5">
        <table className="min-w-full table-auto font-bold border text-[var(--nav-text)] border-[var(--nav-text)] text-sm md:text-base duration-300 transition-colors">
          <thead className="bg-[var(--nav-bg)]">
            <tr>
              {Object.keys(columnHeaders).map((col) => (
                <th
                  key={col}
                  className="p-2 border border-[var(--nav-text)] cursor-pointer"
                  onClick={() => handleSort(col)}
                >
                  {columnHeaders[col]}
                  {sortBy === col ? (order === "asc" ? " ↑" : " ↓") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={TABLE_COLUMN_COUNT_TRANSACTION_USER} className="p-3 border text-center border-[var(--nav-text)]">
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => {
                const canCancel = !["Approved", "Rejected", "Canceled"].includes(tx.state);
                return (
                  <tr key={tx.id} className="bg-[var(--nav-bg)] text-center">
                    <td
                      ref={dropdownOpen === tx.id ? dropdownRef : null}
                      className="p-2 border border-[var(--nav-text)] cursor-pointer underline relative"
                      onClick={() => toggleDropdown(tx.id)}
                    >
                      {tx.transactionId}
                      {dropdownOpen === tx.id && (
                        <div className="absolute bg-[var(--nav-bg)] shadow-md p-2 mt-1 rounded z-50 w-40 border border-[var(--nav-text)]" style={{ left: "50%", transform: "translateX(-50%)" }}>
                          {canCancel ? (
                            <button
                              onClick={() => handleCancel(tx.id, fetchTx)}
                              className="block w-full text-left px-2 py-1 rounded text-sm mt-1 font-bold border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] duration-300 transition-colors"
                            >
                              Cancel
                            </button>
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
                    <td className="p-2 border border-[var(--nav-text)]">${tx.amount.toFixed(AMOUNT_DECIMAL_PLACES)}</td>
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
}

export default UserTransactionsTable;