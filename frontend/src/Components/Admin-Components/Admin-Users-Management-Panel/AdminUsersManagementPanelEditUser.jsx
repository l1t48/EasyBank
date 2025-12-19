import { useState, useEffect, useRef } from 'react';
import { API } from '../../../Services/APIs';
import Toast from '../../../Context/Toast';

const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    accountType: '',
    balance: 0,
};

export default function AdminUsersManagementPanelEditUser({ isOpen, onClose, user, onUserUpdated }) {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("info");

    const overlayRef = useRef(null);
    const modalRef = useRef(null);

    // Sync body scroll and global key listeners
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === "Escape") handleFormClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                accountType: user.accountType || 'User',
                balance: user.balance !== undefined ? user.balance : 0,
            });
            setError(null);
            setShowToast(false);
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleFormClose = () => {
        setFormData(initialFormState);
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (overlayRef.current && e.target === overlayRef.current) handleFormClose();
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        setLoading(true);

        const url = API.admin.updateUser(user.id);

        try {
            const res = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setToastMsg(`User updated successfully!`);
                setToastType("success");
                setShowToast(true);
                onUserUpdated(data.user);
                setTimeout(handleFormClose, 1500);
            } else {
                setError(data.error || 'Failed to update user.');
                setToastMsg(data.error || "Update failed.");
                setToastType("error");
                setShowToast(true);
            }
        } catch (err) {
            setError('Network error or server unreachable.');
            setToastMsg("Network Error");
            setToastType("error");
            setShowToast(true);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !user) return null;

    return (
        <div
            ref={overlayRef}
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 bg-black/50 flex items-start md:items-center justify-center p-4 overflow-y-auto animate__animated animate__fadeIn"
        >
            <div
                ref={modalRef}
                className="bg-[var(--nav-bg)] rounded-xl shadow-lg w-full max-w-xl md:max-w-2xl mt-6 mb-6 max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-black/10"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-[var(--nav-text)]/10">
                    <h2 className="text-lg md:text-2xl font-bold text-[var(--nav-text)]">
                        Edit User's Information
                    </h2>
                    <button
                        onClick={handleFormClose}
                        className="ml-4 rounded p-2 hover:bg-[var(--nav-text)]/10 text-[var(--nav-text)]"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <form id="editUserForm" onSubmit={handleSubmit} className="p-4 overflow-y-auto" style={{ flex: 1 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor="AdminEditUserModalfirstName">First Name</label>
                            <input
                                type="text"
                                id="AdminEditUserModalfirstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor="AdminEditUserModallastName">Last Name</label>
                            <input
                                type="text"
                                id="AdminEditUserModallastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor="AdminEditUserModalemail">Email Address</label>
                            <input
                                type="email"
                                id="AdminEditUserModalemail"
                                name="email"
                                autoComplete="off"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor="AdminEditUserModalaccountType">Account Role</label>
                            <select
                                name="accountType"
                                id="AdminEditUserModalaccountType"
                                value={formData.accountType}
                                onChange={handleChange}
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            >
                                <option value="User">User</option>
                                <option value="Supervisor">Supervisor</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor="AdminEditUserModalbalance">Balance ($)</label>
                            <input
                                type="number"
                                name="balance"
                                id="AdminEditUserModalbalance"
                                value={formData.balance}
                                onChange={handleChange}
                                step="0.01"
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-semibold mt-3">{error}</p>}
                </form>

                {/* Footer */}
                <div className="border-t border-[var(--nav-text)]/10 p-3 bg-gradient-to-t from-[var(--nav-bg)] to-transparent">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleFormClose}
                            disabled={loading}
                            className="w-full sm:w-1/3 font-semibold py-2 rounded-md border border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <div className="flex-1" />
                        <button
                            form="editUserForm"
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-1/3 font-semibold py-2 rounded-md bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <Toast
                message={toastMsg}
                show={showToast}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
}