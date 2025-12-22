import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { API } from "../../../Services/APIs";
import Toast from "../../../Context/Toast";

function UserTransactionsCreateNewTransaction({ isOpen, onClose }) {
  const { token } = useAuth();

  const [transactionType, setTransactionType] = useState("Deposit");
  const [amount, setAmount] = useState("");
  const [targetAccountNumber, setTargetAccountNumber] = useState("");

  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");

  const overlayRef = useRef(null);
  const modalRef = useRef(null);

  // Sync body scroll and global key listeners
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setMessage("");
      setAmount("");
      setTargetAccountNumber("");
      setTransactionType("Deposit");
      setShowToast(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (overlayRef.current && e.target === overlayRef.current) onClose();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);
    setMessage(null);
    setShowToast(false);

    const payload = {
      transactionType,
      amount,
      targetAccountNumber: transactionType === "Transfer" ? targetAccountNumber : undefined
    };

    try {
      const res = await fetch(API.user.createTransaction, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (data.errors && data.errors[0]?.msg) || "Transaction failed");
        setToastMsg("Transaction Failed");
        setToastType("error");
        setShowToast(true);
        return;
      }

      setMessage(data.message || "Transaction created successfully");
      setToastMsg("Transaction Successful!");
      setToastType("success");
      setShowToast(true);

      // Reset Form
      setAmount("");
      setTargetAccountNumber("");
      setTransactionType("Deposit");

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setToastMsg("Transaction Failed");
      setToastType("error");
      setShowToast(true);
    }
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto animate__animated animate__fadeIn"
    >
      <div
        ref={modalRef}
        className="bg-[var(--nav-bg)] rounded-xl shadow-lg w-full max-w-xl md:max-w-2xl overflow-hidden flex flex-col ring-1 ring-black/10"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-[var(--nav-text)]/10">
          <h2 className="text-lg md:text-2xl font-bold text-[var(--nav-text)]">
            Create a New Transaction
          </h2>
          <button
            onClick={onClose}
            className="ml-4 rounded p-2 hover:bg-[var(--nav-text)]/10 text-[var(--nav-text)]"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <form id="createTransactionForm" onSubmit={handleSubmit} className="p-4 overflow-y-auto" style={{ flex: 1 }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label htmlFor="UserCreateNewTransactionTransactionType" className="block text-[var(--nav-text)] text-sm mb-1">
                Transaction Type
              </label>
              <select
                value={transactionType}
                id="UserCreateNewTransactionTransactionType"
                onChange={(e) => setTransactionType(e.target.value)}
                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
              >
                <option value="Deposit">Deposit</option>
                <option value="Withdrawal">Withdrawal</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

            <div>
              <label htmlFor="UserCreateNewTransactionAmount" className="block text-[var(--nav-text)] text-sm mb-1">
                Amount
              </label>
              <input
                id="UserCreateNewTransactionAmount"
                type="number"
                min="149"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                required
              />
            </div>

            {transactionType === "Transfer" && (
              <div className="sm:col-span-2">
                <label htmlFor="UserCreateNewTransactionTargetAccountNumber" className="block text-[var(--nav-text)] text-sm mb-1">
                  Target Account Number
                </label>
                <input
                  type="text"
                  id="UserCreateNewTransactionTargetAccountNumber"
                  placeholder="Enter target account number"
                  value={targetAccountNumber}
                  onChange={(e) => setTargetAccountNumber(e.target.value)}
                  className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                  required
                />
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm font-semibold mt-3">{error}</p>}
          {message && <p className="text-green-500 text-sm font-semibold mt-3">{message}</p>}
        </form>

        {/* Footer */}
        <div className="border-t border-[var(--nav-text)]/10 p-3 bg-gradient-to-t from-[var(--nav-bg)] to-transparent">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/3 font-semibold py-2 rounded-md border border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] transition-all duration-300"
            >
              Cancel
            </button>
            <div className="flex-1" />
            <button
              form="createTransactionForm"
              type="submit"
              className="w-full sm:w-1/3 font-semibold py-2 rounded-md bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>

      <Toast
        message={toastMsg}
        show={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default UserTransactionsCreateNewTransaction;