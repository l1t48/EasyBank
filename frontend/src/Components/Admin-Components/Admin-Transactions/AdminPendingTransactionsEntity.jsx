import { useState, useRef, useEffect } from "react";
import { usePendingTransactionsData } from "../../../Hooks/Admin-Hooks/useAdminPendingTransactions";
import { useAdminActions } from "../../../Hooks/Admin-Hooks/useAdminTransactionsModeration";
import AdminAllTransactionsMobileCards from "./AdminAllTransactionsMobileCards";
import AdminAllTransactionsTable from "./AdminAllTransactionsTable";
import { TABLE_COLUMN_COUNT_PENDING_TRANSACTIONS_ADMIN } from "../../../Data/Global_variables";

function AdminPendingTransactionsEntity({ filters }) {
  const { transactions, loading, handleSort, sortBy, order } = usePendingTransactionsData(filters);
  const { actionLoading, handleApprove, handleReject } = useAdminActions();
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const dropdownRef = useRef(null);
  const toggleDropdown = (id) => setDropdownOpen(dropdownOpen === id ? null : id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return <p className="text-center text-[var(--nav-text)] mt-5">Loading...</p>;

  return (
    <div className="mt-5 w-full">
      <div className="xl:hidden space-y-3">
        {transactions.length === 0 ? (
          <p className="text-center text-[var(--nav-text)]">No pending transactions.</p>
        ) : (
          transactions.map((tx) => (
            <AdminAllTransactionsMobileCards
              key={tx.id}
              tx={tx}
              loadingRow={actionLoading[tx.id] || {}}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          ))
        )}
      </div>

      <div className="hidden xl:block">
        <div className="p-5">
          <table className="min-w-full table-auto font-bold border text-[var(--nav-text)] border-[var(--nav-text)] text-sm md:text-base">
            <thead className="bg-[var(--nav-bg)]">
              <tr>
                {["transactionId", "userAccountNumber", "targetAccountNumber", "transactionType", "amount", "state", "createdAt"].map((col) => (
                  <th
                    key={col}
                    className="duration-300 transition-colors p-2 border border-[var(--nav-text)] cursor-pointer"
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
                  <td colSpan={TABLE_COLUMN_COUNT_PENDING_TRANSACTIONS_ADMIN} className="p-3 border text-center border-[var(--nav-text)]">
                    No pending transactions.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <AdminAllTransactionsTable
                    key={tx.id}
                    tx={tx}
                    dropdownOpen={dropdownOpen}
                    toggleDropdown={toggleDropdown}
                    dropdownRef={dropdownRef}
                    loadingRow={actionLoading[tx.id] || {}}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPendingTransactionsEntity;