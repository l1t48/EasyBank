import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { API } from "../../Services/APIs";
import {
  getAccountNumbersByIds,
  getUserFullNamesByAccountNumbers,
} from "../../Utils/General-Utils/FetchUserData"
const BACK_END_URL = import.meta.env.VITE_API_BACKEND_URL;

const getNormalizedId = (payload) =>
  payload && (payload._id || payload.id || payload.idStr || payload.transactionId || null);

export function usePendingTransactionsData(filters) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const isInitialFetch = useRef(true);

  const handleSort = (column) => {
    setLoading(true);
    if (sortBy === column) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const enrichTransactionData = useCallback(async (tx) => {
    const txId = tx._id || tx.id || null;
    let userAccountNumber = tx.userAccountNumber || null;
    let targetUserName = tx.targetUserName || null;
    const userId = tx.userId || (tx.user && tx.user._id) || null;
    if (!userAccountNumber && userId) {
      const accountResults = await getAccountNumbersByIds([userId]);
      userAccountNumber = accountResults[0]?.accountNumber || null;
    }
    if (tx.targetAccountNumber && !targetUserName) {
      const targetNames = await getUserFullNamesByAccountNumbers([tx.targetAccountNumber]);
      targetUserName = targetNames[0]?.fullName || null;
    }

    return {
      id: txId,
      transactionId: tx.transactionId || "N/A",
      transactionType: tx.transactionType,
      amount: tx.amount,
      state: tx.state,
      userAccountNumber,
      targetAccountNumber: tx.targetAccountNumber || null,
      targetUserName,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
      handledBy: tx.handledBy || tx.handledById || null,
    };
  }, []);

  const fetchPending = useCallback(async () => {
    try {
      if (!isInitialFetch.current) setLoading(true);

      const query = new URLSearchParams({ sortBy, order, ...filters }).toString();
      const res = await fetch(`${API.admin.pendingTransactions}?${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
      });

      const data = await res.json();
      const txList = (data && data.transactions) ? data.transactions : [];

      if (!txList.length) {
        setTransactions([]);
        return;
      }

      const userIds = txList.map((tx) => tx.userId).filter(Boolean);
      const targetAccs = txList.map((tx) => tx.targetAccountNumber).filter(Boolean);
      const [accountResults, targetNames] = await Promise.all([
        userIds.length ? getAccountNumbersByIds(userIds) : [],
        targetAccs.length ? getUserFullNamesByAccountNumbers(targetAccs) : [],
      ]);

      const accountMap = Object.fromEntries(accountResults.map(r => [r.id, r.accountNumber || null]));
      const targetMap = Object.fromEntries(targetNames.map(t => [t.accountNumber, t.fullName || "Unknown User"]));

      const cleaned = txList.map((tx) => ({
        id: tx._id,
        transactionId: tx.transactionId || "N/A",
        transactionType: tx.transactionType,
        amount: tx.amount,
        state: tx.state,
        userAccountNumber: accountMap[tx.userId] || tx.userAccountNumber || null,
        targetAccountNumber: tx.targetAccountNumber || null,
        targetUserName: tx.targetAccountNumber ? targetMap[tx.targetAccountNumber] : null,
        createdAt: tx.createdAt,
        updatedAt: tx.updatedAt,
        handledBy: tx.handledBy || null,
      }));
      setTransactions(cleaned);
    } catch (err) {
      setTransactions([]);
    } finally {
      setLoading(false);
      isInitialFetch.current = false;
    }
  }, [sortBy, order, filters]);

  useEffect(() => {
    const socket = io(BACK_END_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket", "polling"],
      secure: true,                         
      reconnection: true,                   
      reconnectionAttempts: 5,
      reconnectionDelay: 5000,
    });

    const upsertTx = (txObj) => {
      if (!txObj || !txObj.id) return;
      setTransactions((prev) => {
        const exists = prev.some((t) => t.id === txObj.id);
        if (exists) return prev.map((t) => (t.id === txObj.id ? { ...t, ...txObj } : t));
        return [txObj, ...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      });
    };

    const removeTxByPayload = (payload) => {
      const id = getNormalizedId(payload);
      if (!id) return;
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    };

    socket.on("socket:connected", () => {
      fetchPending();
    });

    const handleNewTransaction = async (newTx) => {
      try {
        const cleanedTx = await enrichTransactionData(newTx);
        if (cleanedTx.state === 'Pending' || !cleanedTx.state) upsertTx(cleanedTx);
      } catch (err) {
        await fetchPending();
      }
    };

    socket.on("pendingTransactionCreated", handleNewTransaction);
    socket.on("transactionCreated", handleNewTransaction);

    ["transactionApproved", "transactionRejected", "transactionCanceled", "transactionFailed"].forEach((event) => {
      socket.on(event, removeTxByPayload);
    });

    socket.on("transactionUpdated", async (updatedTx) => {
      const updatedId = getNormalizedId(updatedTx);
      if (!updatedId) return;

      if (updatedTx.state && updatedTx.state !== "Pending") {
        removeTxByPayload(updatedTx);
        return;
      }

      try {
        const normalized = { id: updatedId, ...updatedTx };
        upsertTx(normalized);

        const enriched = await enrichTransactionData(updatedTx);
        if (enriched?.id) upsertTx(enriched);
      } catch (err) {
        console.error("Admin: Error handling transactionUpdated");
      }
    });

    if (isInitialFetch.current) {
      fetchPending();
    }

    return () => {
      socket.off("pendingTransactionCreated", handleNewTransaction);
      socket.off("transactionCreated", handleNewTransaction);
      ["transactionApproved", "transactionRejected", "transactionCanceled", "transactionFailed"].forEach((event) => {
        socket.off(event, removeTxByPayload);
      });
      socket.off("transactionUpdated");
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [enrichTransactionData, fetchPending, filters]);

  useEffect(() => {
    if (!isInitialFetch.current) {
      fetchPending();
    }
  }, [sortBy, order, filters, fetchPending]);

  return {
    transactions,
    loading,
    handleSort,
    sortBy,
    order,
  };
}