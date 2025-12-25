import { useEffect } from "react";
import { API } from "../../Services/APIs";
import { getAccountNumbersByIds, getUserFullNamesByAccountNumbers } from "../../Utils/General-Utils/FetchUserData";

export function useFetchTransactions({ sortBy, order, filters, setTransactions, setLoading }) {
  useEffect(() => {
    const fetchAllTransactions = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          sortBy,
          order,
          ...filters
        }).toString();

        const res = await fetch(`${API.admin.allTransactions}?${query}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        const txList = data.transactions || [];

        if (!txList.length) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        const userIds = txList.map((tx) => tx.userId).filter(Boolean);
        const accountResults = await getAccountNumbersByIds(userIds);
        const accountMap = {};
        accountResults.forEach((r) => { accountMap[r.id] = r.accountNumber || null; });
        const targetAccs = txList.map((tx) => tx.targetAccountNumber).filter(Boolean);
        const targetNames = await getUserFullNamesByAccountNumbers(targetAccs);
        const targetMap = {};
        targetNames.forEach((t) => { targetMap[t.accountNumber] = t.fullName || "Unknown User"; });

        const cleaned = txList.map((tx) => ({
          id: tx._id,
          transactionId: tx.transactionId || 'N/A',
          transactionType: tx.transactionType,
          amount: tx.amount,
          state: tx.state,
          userAccountNumber: accountMap[tx.userId] || tx.userAccountNumber || null,
          targetAccountNumber: tx.targetAccountNumber || null,
          targetUserName: tx.targetAccountNumber ? targetMap[tx.targetAccountNumber] : null,
          createdAt: tx.createdAt,
          updatedAt: tx.updatedAt,
        }));

        setTransactions(cleaned);
      } catch (err) {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTransactions();
  }, [sortBy, order, filters, setTransactions, setLoading]);
}