import { useEffect, useRef } from "react";
import { useTransactionState } from "../../../Hooks/Admin-Hooks/useAdminTransactionState";
import { useFetchTransactions } from "../../../Hooks/Admin-Hooks/useAdminFetchTransactions";
import { useRealTimeTransactions } from "../../../Hooks/Admin-Hooks/useAdminRealTimeTransactions";
import { AMOUNT_DECIMAL_PLACES, TABLE_COLUMN_COUNT_ALL_TRANSACTION_ADMIN } from "../../../Data/Global_variables";

function AdminAllTransactionsEntity({ filters }) {
  const { 
    transactions, 
    setTransactions, 
    loading, 
    setLoading,
    sortBy, 
    order, 
    handleSort,
    dropdownOpen, 
    setDropdownOpen, 
    toggleDropdown 
  } = useTransactionState();
  const dropdownRef = useRef(null);

  useFetchTransactions({ sortBy, order, filters, setTransactions, setLoading });
  useRealTimeTransactions({ setTransactions });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen, setDropdownOpen]);

  if (loading) return <p className="text-center text-[var(--nav-text)] mt-5">Loading all transactions...</p>;

  return (
    <div className="mt-5 w-full">
      <div className="xl:hidden space-y-3">
        {transactions.length === 0 ? (
          <p className="text-center text-[var(--nav-text)]">No transactions found.</p>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="rounded shadow border text-base bg-[var(--nav-bg)] border-[var(--nav-text)] p-3 text-[var(--nav-text)]">
              <div className="flex justify-start mb-1"><span className="font-bold">{tx.transactionId}</span></div>
              <div className="flex justify-between mb-1 mt-5"><span className="font-semibold">User Bank Number:</span><span>{tx.userAccountNumber || "-"}</span></div>
              <div className="flex justify-between mb-1"><span className="font-semibold">Target Account Number:</span><span>{tx.targetAccountNumber || "-"}</span></div>
              <div className="flex justify-between mb-1"><span className="font-semibold">Type:</span><span>{tx.transactionType}</span></div>
              <div className="flex justify-between mb-1"><span className="font-semibold">Amount:</span><span>${Number(tx.amount).toFixed(AMOUNT_DECIMAL_PLACES)}</span></div>
              <div className="flex justify-between mb-1"><span className="font-semibold">State:</span><span>{tx.state}</span></div>
              <div className="flex justify-between mt-3"><span className="font-semibold">Created:</span><span>{new Date(tx.createdAt).toLocaleDateString()}</span></div>
            </div>
          ))
        )}
      </div>

      <div className="hidden xl:block">
        <div className="p-5 overflow-x-auto">
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
                  <td colSpan={TABLE_COLUMN_COUNT_ALL_TRANSACTION_ADMIN} className="p-3 border text-center border-[var(--nav-text)]">No transactions found.</td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="bg-[var(--nav-bg)] text-center">
                    <td ref={dropdownOpen === tx.id ? dropdownRef : null} className="p-2 border border-[var(--nav-text)] cursor-pointer underline relative" onClick={() => toggleDropdown(tx.id)}>
                      {tx.transactionId}
                      {dropdownOpen === tx.id && (
                        <div className="absolute bg-[var(--nav-bg)] shadow-md p-2 mt-1 rounded z-50 w-40 border border-[var(--nav-text)]" style={{ left: "50%", transform: "translateX(-50%)" }}>
                          <span className="text-xs text-[var(--nav-text)]">Details (Future Feature)</span>
                        </div>
                      )}
                    </td>
                    <td className="p-2 border border-[var(--nav-text)]">{tx.userAccountNumber || "-"}</td>
                    <td className="p-2 border border-[var(--nav-text)]">{tx.targetAccountNumber || "-"}</td>
                    <td className="p-2 border border-[var(--nav-text)]">{tx.transactionType}</td>
                    <td className="p-2 border border-[var(--nav-text)]">${Number(tx.amount).toFixed(AMOUNT_DECIMAL_PLACES)}</td>
                    <td className="p-2 border border-[var(--nav-text)]"><span>{tx.state}</span></td>
                    <td className="p-2 border border-[var(--nav-text)]">{new Date(tx.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAllTransactionsEntity;