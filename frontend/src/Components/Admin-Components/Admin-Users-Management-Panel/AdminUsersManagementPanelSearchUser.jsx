import { useState, useEffect, useRef, useId } from 'react';
import { API } from '../../../Services/APIs';
import Toast from '../../../Context/Toast';
import { NOT_FOUND, AMOUNT_DECIMAL_PLACES } from '../../../Data/Global_variables';

export default function AdminUsersManagementPanelSearchUser({ isOpen, onClose }) {
    const [accountNumber, setAccountNumber] = useState('');
    const [foundUser, setFoundUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const idPrefix = useId();
    const [toastMsg, setToastMsg] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastType, setToastType] = useState("info");

    const overlayRef = useRef(null);
    const modalRef = useRef(null);

    // Global listeners and body scroll lock
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => (document.body.style.overflow = "");
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen]);

    if (!isOpen) return null;

    const clearMessages = () => {
        setError(null);
        setFoundUser(null);
        setShowToast(false);
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString();
    };

    const handleBackdropClick = (e) => {
        if (overlayRef.current && e.target === overlayRef.current) handleClose();
    };

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        clearMessages();
        setLoading(true);

        if (!accountNumber.trim()) {
            setError("Please enter an Account Number to search.");
            setLoading(false);
            return;
        }

        try {
            const userUrl = API.admin.getUser(accountNumber);
            const response = await fetch(userUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                setFoundUser(data.user);
                setToastMsg(`User found: ${data.user.firstName} ${data.user.lastName}`);
                setToastType("success");
                setShowToast(true);
            } else if (response.status === NOT_FOUND) {
                setError(`Error: User with Account Number '${accountNumber}' not found.`);
                setToastMsg("User not found.");
                setToastType("error");
                setShowToast(true);
            } else {
                setError(data.error || 'Failed to fetch user.');
                setToastMsg("Search failed.");
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

    const handleClose = () => {
        setAccountNumber(''); 
        clearMessages();
        onClose();
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleBackdropClick}
className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto animate__animated animate__fadeIn"
        >
            <div
                ref={modalRef}
                className="bg-[var(--nav-bg)] rounded-xl shadow-lg w-full max-w-xl md:max-w-2xl mt-6 mb-6 max-h-[90vh] overflow-hidden flex flex-col ring-1 ring-black/10"
            >
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-[var(--nav-text)]/10">
                    <h2 className="text-lg md:text-2xl font-bold text-[var(--nav-text)]">
                        Search a User
                    </h2>
                    <button 
                        onClick={handleClose} 
                        className="ml-4 rounded p-2 hover:bg-[var(--nav-text)]/10 text-[var(--nav-text)]"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 overflow-y-auto" style={{ flex: 1 }}>
                    <form id="searchUserForm" onSubmit={handleSearch} className="mb-6">
                        <label className="block text-[var(--nav-text)] text-sm mb-1" htmlFor={`${idPrefix}-accountNumber`}>
                            Account Number
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <input
                                type="text"
                                id={`${idPrefix}-accountNumber`}
                                name={`${idPrefix}-accountNumber`}
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                                placeholder="e.g. 60c72b9..."
                                className="flex-1 p-2 border border-[var(--nav-text)] bg-[var(--nav-bg)] text-[var(--nav-hover)] rounded outline-none focus:ring focus:ring-[var(--nav-hover)]"
                            />
                        </div>
                    </form>

                    {error && <p className="text-red-500 text-sm font-semibold mb-4">{error}</p>}

                    {foundUser && (
                        <div className="border border-[var(--nav-text)]/20 p-4 rounded-lg bg-[var(--nav-text)]/5 animate__animated animate__fadeIn">
                            <h3 className="text-lg font-bold mb-3 text-[var(--nav-text)] border-b border-[var(--nav-text)]/10 pb-2">
                                User Account Summary
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 text-sm">
                                <p className="text-[var(--nav-text)]"><strong>Account:</strong> <span className="opacity-80">{foundUser.accountNumber}</span></p>
                                <p className="text-[var(--nav-text)]"><strong>Name:</strong> <span className="opacity-80">{foundUser.firstName} {foundUser.lastName}</span></p>
                                <p className="text-[var(--nav-text)]"><strong>Email:</strong> <span className="opacity-80">{foundUser.email}</span></p>
                                <p className="text-[var(--nav-text)]"><strong>Role:</strong> <span className="opacity-80">{foundUser.accountType}</span></p>
                                <p className="text-[var(--nav-text)]"><strong>Member Since:</strong> <span className="opacity-80">{formatDate(foundUser.creationDate)}</span></p>
                                <p className="text-[var(--nav-text)] font-semibold text-base sm:col-span-2 mt-2 pt-2 border-t border-[var(--nav-text)]/10">
                                    Balance: ${foundUser.balance ? foundUser.balance.toFixed(AMOUNT_DECIMAL_PLACES) : '0.00'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-[var(--nav-text)]/10 p-3 bg-gradient-to-t from-[var(--nav-bg)] to-transparent">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="w-full sm:w-1/3 font-semibold py-2 rounded-md border border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] transition-all duration-300"
                        >
                            Close
                        </button>
                        <div className="flex-1" />
                        <button
                            form="searchUserForm"
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-1/3 font-semibold py-2 rounded-md bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] transition-all duration-300"
                        >
                            {loading ? 'Searching...' : 'Search User'}
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