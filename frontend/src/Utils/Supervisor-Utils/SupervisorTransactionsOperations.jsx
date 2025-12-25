import { API } from "../../Services/APIs";

export const handleApprove = async (id, setRowLoading, onComplete) => {
    if (!window.confirm("Approve this transaction?")) return;
    setRowLoading(id, "Approve", true);
    try {
        const res = await fetch(API.supervisor?.approveTransaction || "/approve-transaction", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
            body: JSON.stringify({ transactionId: id }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            alert(data.error || "Failed to approve transaction.");
        } else {
            onComplete(id);
        }
    } catch (err) {
        alert("Server error while approving transaction.");
    } finally {
        setRowLoading(id, "Approve", false);
    }
};

export const handleReject = async (id, setRowLoading, onComplete) => {
    if (!window.confirm("Reject this transaction?")) return;
    setRowLoading(id, "Reject", true);
    try {
        const res = await fetch(API.supervisor?.rejectTransaction || "/reject-transaction", {
            method: "POST",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
            body: JSON.stringify({ transactionId: id }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
            alert(data.error || "Failed to reject transaction.");
        } else {
            onComplete(id);
        }
    } catch (err) {
        alert("Server error while rejecting transaction.");
    } finally {
        setRowLoading(id, "Reject", false);
    }
};