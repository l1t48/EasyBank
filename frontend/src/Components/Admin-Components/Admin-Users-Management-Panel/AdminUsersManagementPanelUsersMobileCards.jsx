function AdminUsersManagementPanelUsersMobileCards({ user, loadingRow, onEditClick, onDeleteClick }) {
    return (
        <div
            key={user.id}
            className="rounded shadow border text-base bg-[var(--nav-bg)] border-[var(--nav-text)] p-3 text-[var(--nav-text)]"
        >
            <div className="flex justify-start mb-1 duration-300 transition-colors">
                <span className="font-bold">{user.fullName}</span>
            </div>
            <div className="flex justify-between mb-1 mt-5 duration-300 transition-colors">
                <span className="font-semibold">Account Number:</span>
                <span>{user.accountNumber || "-"}</span>
            </div>
            <div className="flex justify-between mb-1 duration-300 transition-colors">
                <span className="font-semibold">Email:</span>
                <span>{user.email}</span>
            </div>
            <div className="flex justify-between mb-1 duration-300 transition-colors">
                <span className="font-semibold">Account Type:</span>
                <span>{user.accountType}</span>
            </div>
            <div className="flex justify-between mt-3 duration-300 transition-colors">
                <span className="font-semibold">Created:</span>
                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</span>
            </div>
            <div className="flex justify-end gap-3 mt-3">
                <button
                    onClick={() => onEditClick(user)}
                    disabled={loadingRow.delete}
                    className={`duration-300 transition-colors px-3 py-1 text-xs font-bold rounded border ${loadingRow.delete ? "opacity-60 cursor-wait" : "bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)] duration-300 transition-colors"}`}
                >
                    Edit User
                </button>
                <button
                    onClick={() => onDeleteClick(user)}
                    disabled={loadingRow.delete}
                    className={`duration-300 transition-colors px-3 py-1 text-xs font-bold rounded border ${loadingRow.delete ? "opacity-60 cursor-wait" : "border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] duration-300 transition-colors"}`}
                >
                    {loadingRow.delete ? "Deleting..." : "Delete User"}
                </button>
            </div>
        </div>
    );
}

export default AdminUsersManagementPanelUsersMobileCards;