import { useState, useEffect, useCallback } from "react";
import { API } from "../../Services/APIs";
import { io } from "socket.io-client";
import { useAuth } from "../../Context/AuthContext";

const BACK_END_URL = import.meta.env.VITE_API_BACKEND_URL;

function useTransactions(filters, setToast) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const { user } = useAuth();

  const processTx = (tx) => ({
    id: tx._id || tx.id || null,
    transactionId: tx.transactionId || "N/A",
    transactionType: tx.transactionType || "N/A",
    amount: Number(tx.amount) || 0,
    state: tx.state || "unknown",
    userName: tx.user ? `${tx.user.firstName} ${tx.user.lastName}`.trim() : "Unknown",
    userAccountNumber: tx.user?.accountNumber || "-",
    targetUserName: tx.target ? `${tx.target.firstName} ${tx.target.lastName}`.trim() : "-",
    targetAccountNumber: tx.targetAccountNumber || "-",
    createdAt: tx.createdAt || new Date().toISOString(),
    updatedAt: tx.updatedAt || new Date().toISOString()
  });

  const fetchTx = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ sortBy, order, ...filters }).toString();
      const res = await fetch(`${API.user.transactions}?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();
      const txList = data.transactions || [];
      setTransactions(txList.map(processTx));
    } catch (err) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [sortBy, order, filters]);

  useEffect(() => {
    fetchTx();
  }, [fetchTx]);

  useEffect(() => {
    if (!BACK_END_URL) return;

    const socket = io(BACK_END_URL, {
      auth: { token: localStorage.getItem("token") }
    });

    const handleStatusUpdate = (updatedTxRaw) => {
      const updatedTx = processTx(updatedTxRaw);
      if (!updatedTx.id) return fetchTx();

      setTransactions((prev) => {
        const exists = prev.some((tx) => tx.id === updatedTx.id);
        if (exists) {
          return prev.map((tx) =>
            tx.id === updatedTx.id
              ? { ...tx, state: updatedTx.state, updatedAt: updatedTx.updatedAt, amount: updatedTx.amount }
              : tx
          );
        }
        fetchTx();
        return prev;
      });

      if (updatedTxRaw.userId === user?.id) {
        setToast(`Your Transaction ${updatedTx.transactionId} was ${updatedTx.state}`, updatedTx.state === "Approved" ? "success" : "error");
      } else if (updatedTxRaw.targetAccountNumber === user?.accountNumber) {
        setToast(`You received $${updatedTx.amount} from ${updatedTx.transactionId}`, updatedTx.state === "Approved" ? "success" : "error");
      }
    };

    socket.on("transactionCreated", fetchTx);
    socket.on("transactionUpdated", handleStatusUpdate);
    socket.on("transactionCanceled", handleStatusUpdate);
    socket.on("transactionApproved", handleStatusUpdate);
    socket.on("transactionRejected", handleStatusUpdate);
    socket.on("transactionFailed", handleStatusUpdate);

    return () => socket.disconnect();
  }, [fetchTx, user, setToast]);

  const handleSort = (column) => {
    if (sortBy === column) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  return { transactions, loading, sortBy, order, handleSort, fetchTx };
}

export default useTransactions;