import { useState } from "react";

export function useTransactionState() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const handleSort = (column) => {
    if (sortBy === column) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  const toggleDropdown = (id) => setDropdownOpen(dropdownOpen === id ? null : id);

  return {
    transactions,
    setTransactions,
    loading,
    setLoading,
    sortBy,
    order,
    handleSort,
    dropdownOpen,
    setDropdownOpen,
    toggleDropdown,
  };
}