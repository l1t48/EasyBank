import { useState, useEffect, useCallback, useRef } from "react";
import { API } from "../../Services/APIs";
import { io } from "socket.io-client";
import { getAccountNumbersByIds, getUserFullNamesByAccountNumbers } from "../../Utils/General-Utils/FetchUserData";

const BACK_END_URL = import.meta.env.VITE_API_BACKEND_URL;

const getNormalizedId = (payload) => payload && (payload._id || payload.id || payload.idStr || null);

const normalizePayload = (tx) => ({
  id: getNormalizedId(tx),
  transactionId: tx.transactionId || 'N/A',
  transactionType: tx.transactionType,
  amount: tx.amount,
  state: tx.state,
  userAccountNumber: tx.userAccountNumber || null,
  targetAccountNumber: tx.targetAccountNumber || null,
  targetUserName: tx.targetUserName || null,
  createdAt: tx.createdAt,
  updatedAt: tx.updatedAt,
});

export function usePendingTransactions(filters) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const transactionsRef = useRef(transactions);
  
  useEffect(() => {
    transactionsRef.current = transactions;
  }, [transactions]);

  const handleSort = (column) => {
    if (sortBy === column) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const enrichTransactionData = useCallback(async (tx) => {
    const userId = tx.userId || tx.user?._id || null;
    const userAccountNumber = tx.userAccountNumber || (userId ? (await getAccountNumbersByIds([userId]))[0]?.accountNumber : null);
    const targetAccountNumber = tx.targetAccountNumber || null;
    const targetUserName = targetAccountNumber ? (await getUserFullNamesByAccountNumbers([targetAccountNumber]))[0]?.fullName : null;

    return {
      id: getNormalizedId(tx),
      transactionId: tx.transactionId || 'N/A',
      transactionType: tx.transactionType,
      amount: tx.amount,
      state: tx.state,
      userAccountNumber,
      targetAccountNumber,
      targetUserName,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    };
  }, []); 

  useEffect(() => {
    const fetchPending = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({ sortBy, order, ...filters }).toString();
        const res = await fetch(`${API.supervisor?.pendingTransactions || "/pending-transactions"}?${query}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        const txList = data.transactions || [];

        if (!txList.length) {
          setTransactions([]);
          return;
        }

        const userIds = txList.map((tx) => tx.userId).filter(Boolean);
        const targetAccs = txList.map((tx) => tx.targetAccountNumber).filter(Boolean);

        const [accountResults, targetNames] = await Promise.all([
          getAccountNumbersByIds(userIds),
          getUserFullNamesByAccountNumbers(targetAccs),
        ]);

        const accountMap = Object.fromEntries(accountResults.map(r => [r.id, r.accountNumber || null]));
        const targetMap = Object.fromEntries(targetNames.map(t => [t.accountNumber, t.fullName || "Unknown User"]));

        const cleaned = txList.map((tx) => ({
          id: tx._id,
          transactionId: tx.transactionId || 'N/A',
          transactionType: tx.transactionType,
          amount: tx.amount,
          state: tx.state,
          userAccountNumber: accountMap[tx.userId] || null,
          targetAccountNumber: tx.targetAccountNumber || null,
          targetUserName: tx.targetAccountNumber ? targetMap[tx.targetAccountNumber] : null,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
        }));

        setTransactions(cleaned);
      } catch (err) {
        console.error("Error loading pending transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [sortBy, order, filters]);

  useEffect(() => {
    const socket = io(BACK_END_URL, { auth: { token: localStorage.getItem("token") } });

    const handleFinalizedTransaction = (updatedTx) => {
      const id = getNormalizedId(updatedTx);
      if (!id) return console.warn("Finalized tx missing id", updatedTx);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    };

    ["pendingTransactionCreated", "transactionCreated"].forEach((evt) => {
      socket.on(evt, async (newTx) => {
        try {
          if (transactionsRef.current.some(t => t.id === getNormalizedId(newTx))) return;
          const enriched = await enrichTransactionData(newTx);
          setTransactions((prev) => [enriched, ...prev]);
        } catch (err) {
          console.error(`Error handling ${evt}:`, err);
        }
      });
    });

    ["transactionApproved", "transactionRejected", "transactionCanceled", "transactionFailed"]
      .forEach((evt) => socket.on(evt, handleFinalizedTransaction));

    socket.on("transactionUpdated", async (updatedTx) => {
      const id = getNormalizedId(updatedTx);
      if (!id) return console.warn("transactionUpdated: missing id", updatedTx);

      if (updatedTx.state && updatedTx.state !== "Pending") {
        setTransactions((prev) => prev.filter((tx) => tx.id !== id));
        return;
      }

      const normalized = normalizePayload(updatedTx);

      setTransactions((prev) => {
        const exists = prev.some((tx) => tx.id === id);
        if (exists) return prev.map((tx) => (tx.id === id ? { ...tx, ...normalized } : tx));

        enrichTransactionData(updatedTx).then(enriched => {
            setTransactions(p => [enriched, ...p.filter(t => t.id !== enriched.id)]);
        }).catch(err => console.error("Error enriching updated transaction:", err));

        return prev;
      });
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [enrichTransactionData]);


  const setRowLoading = (id, kind, value) => {
    setActionLoading((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), [kind]: value } }));
  };

  const removeTransaction = (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  };


  return {
    transactions,
    loading,
    actionLoading,
    sortBy,
    order,
    handleSort,
    setRowLoading,
    removeTransaction,
  };
}