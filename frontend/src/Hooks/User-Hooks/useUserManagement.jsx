import { useEffect, useState, useCallback } from "react";
import { API } from "../../Services/APIs";

const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export function useUserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState({}); 

    const setRowLoading = useCallback((id, kind, value) => {
        setActionLoading((prev) => ({
            ...prev,
            [id]: { ...(prev[id] || {}), [kind]: value },
        }));
    }, []);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const token = getToken();
        if (!token) {
            console.error("Token not found.");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`${API.admin.allUsers}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
            const userList = (data && data.users) ? data.users : [];

            const cleaned = userList.map((u) => ({
                id: u._id || u.id,
                accountNumber: u.accountNumber || "-",
                firstName: u.firstName || "",
                lastName: u.lastName || "",
                fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.username || "Unknown",
                email: u.email || "-",
                accountType: u.accountType || "User",
                balance: u.balance !== undefined ? u.balance : 0,
                createdAt: u.createdAt || null,
                disabled: !!u.disabled,
            }));
            setUsers(cleaned);
        } catch (err) {
            console.error("Error loading all users:", err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDeleteUser = useCallback(async (user) => {
        if (!window.confirm(`Are you sure you want to PERMANENTLY delete the user: ${user.fullName} (${user.accountNumber})? This action cannot be undone.`)) {
            return;
        }
        setRowLoading(user.id, "delete", true);
        try {
            const url = API.admin.deleteUser(user.id);
            const res = await fetch(url, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
            });

            let data = { success: false, error: "Empty response from server" };
            const text = await res.text();

            try {
                if (text) {
                    data = JSON.parse(text);
                }
            } catch (e) {
                console.warn("Response was not valid JSON:", e);
            }

            if (res.ok && (data.success || !text)) {
                setUsers(prev => prev.filter(u => u.id !== user.id));
                alert(`User ${user.fullName} deleted successfully.`);
            } else {
                alert(data.error || `Failed to delete user. Server Status: ${res.status}`);
            }
        } catch (err) {
            console.error("Admin delete user error:", err);
            alert("A network error occurred while deleting the user.");
        } finally {
            setRowLoading(user.id, "delete", false);
        }
    }, [setRowLoading]);

    const handleUserUpdated = useCallback((updatedUser) => {
        setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === updatedUser._id || u.id === updatedUser.id) {
                return {
                    ...u,
                    fullName: `${updatedUser.firstName} ${updatedUser.lastName}`,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email,
                    accountType: updatedUser.accountType,
                    balance: updatedUser.balance,
                };
            }
            return u;
        }));
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        actionLoading,
        fetchUsers,
        handleDeleteUser,
        handleUserUpdated,
    };
}