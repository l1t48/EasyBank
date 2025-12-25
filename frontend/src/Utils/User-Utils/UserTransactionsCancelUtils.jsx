import { API } from "../../Services/APIs";

export const handleCancel = async (id, fetchTx) => {
  if (!window.confirm("Are you sure you want to cancel this transaction?")) return;
  try {
    const res = await fetch(API.user.cancelTransaction(id), {
      method: "PATCH",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      alert(data.error || "Failed to cancel transaction.");
    } else {
      fetchTx(); 
    }
  } catch (err) {
    alert("Server error while canceling transaction.");
  }
};