
import { useState } from "react";
import { API } from "../../Services/APIs";

export function useAdminActions() {
  const [actionLoading, setActionLoading] = useState({});
  const setRowLoading = (id, kind, value) => {
    setActionLoading((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [kind]: value },
    }));
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this transaction?")) return;
    setRowLoading(id, "Approve", true);
    try {
      const res = await fetch(API.admin.approveTransaction, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) alert(data.error || "Failed to approve transaction.");
    } catch (err) {
      console.error("Admin approve transaction error:", err);
      alert("Server error while approving transaction.");
    } finally {
      setRowLoading(id, "Approve", false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this transaction?")) return;
    setRowLoading(id, "Reject", true);
    try {
      const res = await fetch(API.admin.rejectTransaction, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId: id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) alert(data.error || "Failed to reject transaction.");
    } catch (err) {
      console.error("Admin reject transaction error:", err);
      alert("Server error while rejecting transaction.");
    } finally {
      setRowLoading(id, "Reject", false);
    }
  };

  return { actionLoading, handleApprove, handleReject };
}