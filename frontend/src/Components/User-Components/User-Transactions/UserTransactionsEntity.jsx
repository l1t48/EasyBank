import Toast from "../../../Context/Toast";
import useTransactions from "../../../Hooks/User-Hooks/useUserTransactions";
import useToast from "../../../Hooks/General-Hooks/useToast";
import UserTransactionsTable from "./UserTransactionsTable";
import UserTransactionsMobileCards from "./UserTransactionsMobileCards";

function UserTransactionsEntity({ filters }) {
  const { toastMsg, showToast, toastType, setToast, closeToast } = useToast();
  const { transactions, loading, sortBy, order, handleSort, fetchTx } = useTransactions(filters, setToast);

  if (loading) {
    return (
      <div className="mt-5 w-full px-2 sm:px-4">
        <p className="text-center text-[var(--nav-text)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-stretch px-4 sm:px-6 lg:px-8">
      <div className="mt-5 w-full px-2 sm:px-4">
        <UserTransactionsMobileCards 
          transactions={transactions} 
          fetchTx={fetchTx} 
        />
        <UserTransactionsTable
          transactions={transactions}
          sortBy={sortBy}
          order={order}
          handleSort={handleSort}
          fetchTx={fetchTx}
        />
      </div>

      <Toast
        message={toastMsg}
        show={showToast}
        type={toastType}
        onClose={closeToast}
      />
    </div>
  );
}

export default UserTransactionsEntity;
