import { useEffect } from "react";
import { io } from "socket.io-client";
import { 
  getNormalizedId, 
  normalizePayload, 
  enrichTransactionData 
} from "../../Utils/Admin-Utils/AdminTransactionUtils";
const BACK_END_URL = import.meta.env.VITE_API_BACKEND_URL;

export function useRealTimeTransactions({ setTransactions }) {
  useEffect(() => {
    const socket = io(BACK_END_URL, {
      auth: { token: localStorage.getItem("token") },
    });

    ["pendingTransactionCreated", "transactionCreated"].forEach((evt) => {
      socket.on(evt, async (newTx) => {
        try {
          const enriched = await enrichTransactionData(newTx);
          setTransactions((prev) => [enriched, ...prev.filter((t) => t.id !== enriched.id)]);
        } catch (err) {
          console.error(`Error handling ${evt}:`, err);
        }
      });
    });

    socket.on("transactionUpdated", async (updatedTx) => {
      const id = getNormalizedId(updatedTx);
      if (!id) return console.warn("transactionUpdated: missing id", updatedTx);

      try {
        const normalized = normalizePayload(updatedTx);
        
        setTransactions((prev) => {
          const exists = prev.some((tx) => tx.id === id);
          if (exists) {
            return prev.map((tx) => (tx.id === id ? { ...tx, ...normalized } : tx));
          } else {
            enrichTransactionData(updatedTx).then(enriched => {
              setTransactions(current => [enriched, ...current.filter(t => t.id !== enriched.id)]);
            }).catch(err => console.error("Error enriching late update:", err));
            return prev;
          }
        });
      } catch (err) {
        console.error("Error handling transactionUpdated:", err);
      }
    });

    ["transactionApproved", "transactionRejected", "transactionCanceled", "transactionFailed"]
      .forEach((evt) => socket.on(evt, async (updatedTx) => {
        const id = getNormalizedId(updatedTx);
        if (!id) return;
        const normalized = normalizePayload(updatedTx);
        setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, ...normalized } : tx)));
      }));

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [setTransactions]);
}