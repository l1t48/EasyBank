import { useState, useEffect, useRef, useId } from 'react';
import { API } from '../../../Services/APIs';
import Toast from '../../../Context/Toast';
const allowedRoles = ["User", "Admin", "Supervisor"];

export default function AdminUsersManagementPanelCreateUser({ isOpen, onClose, onUserCreated }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        accountType: 'User',
    });
    const idPrefix = useId();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("info");
    const overlayRef = useRef(null);
    const modalRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                accountType: 'User',
            });
            setError(null);
            setSuccess(null);
            setShowToast(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
        setSuccess(null);
        setShowToast(false);
    };
    const handleBackdropClick = (e) => {
        if (overlayRef.current && e.target === overlayRef.current) onClose();
    };
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setError(null);
        setSuccess(null);
        setShowToast(false);
        setLoading(true);
        try {
            const response = await fetch(API.admin.createUser, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setSuccess(`User created successfully!`);
                setToastMsg(`User created successfully!`);
                setToastType("success");
                setShowToast(true);

                if (onUserCreated) onUserCreated(data.user);
                setFormData({ firstName: '', lastName: '', email: '', password: '', accountType: 'User' });
            }
            if (!response.ok) {
                const errorMessage = data.errors?.[0]?.msg || data.error || 'Failed to create user.';
                setToastMsg(errorMessage);
                setToastType("error");
                setShowToast(true);
                setError(errorMessage);
            }
        } catch (err) {
            setToastMsg("Network Error");
            setToastType("error");
            setShowToast(true);
            setError('Network error or server unreachable.');
        } finally {
            setLoading(false);
        }
    };

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
                <div className="flex items-start justify-between p-4 border-b border-[var(--nav-text)]/10">
                    <h2 className="text-lg md:text-2xl font-bold text-[var(--nav-text)]">
                        Create a New User
                    </h2>
                    <button
                        onClick={onClose}
                        className="ml-4 rounded p-2 hover:bg-[var(--nav-text)]/10 text-[var(--nav-text)]"
                    >
                        ✕
                    </button>
                </div>
                <form id="createUserForm" onSubmit={handleSubmit} className="p-4 overflow-y-auto" style={{ flex: 1 }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor={`${idPrefix}-firstName`}>First Name</label>
                            <input
                                type="text"
                                id={`${idPrefix}-firstName`}
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor={`${idPrefix}-lastName`}>Last Name</label>
                            <input
                                type="text"
                                id={`${idPrefix}-lastName`}
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor={`${idPrefix}-email`}>Email Address</label>
                            <input
                                type="email"
                                id={`${idPrefix}-email`}
                                name="email"
                                autoComplete="off"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor={`${idPrefix}-password`}>Password</label>
                            <input
                                type="password"
                                autoComplete="off"
                                id={`${idPrefix}-password`}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                        <div>
                            <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor={`${idPrefix}-accountType`}>Account Role</label>
                            <select
                                name="accountType"
                                id={`${idPrefix}-accountType`}
                                value={formData.accountType}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            >
                                {allowedRoles.map(role => (
                                    <option key={role} value={role}>{role}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm font-semibold mt-3">{error}</p>}
                    {success && <p className="text-green-500 text-sm font-semibold mt-3">{success}</p>}
                </form>
                <div className="border-t border-[var(--nav-text)]/10 p-3 bg-gradient-to-t from-[var(--nav-bg)] to-transparent">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="w-full sm:w-1/3 font-semibold py-2 rounded-md border border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] transition-all duration-300"
                        >
                            Cancel
                        </button>
                        <div className="flex-1" />
                        <button
                            form="createUserForm"
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-1/3 font-semibold py-2 rounded-md bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300"
                        >
                            {loading ? 'Creating...' : 'Create User'}
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
