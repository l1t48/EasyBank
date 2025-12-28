function AdminUsersManagementPanelUsersTable({ user, loadingRow, dropdownOpen, toggleDropdown, dropdownRef, onEditClick, onDeleteClick }) {
    const isDropdownOpen = dropdownOpen === user.id;

    const handleEditClickWrapper = (e) => {
        e.stopPropagation();
        onEditClick(user);
    };
    const handleDeleteClickWrapper = (e) => {
        e.stopPropagation();
        onDeleteClick(user);
    };

    return (
        <tr key={user.id} className="bg-[var(--nav-bg)] text-center">
            <td
                ref={isDropdownOpen ? dropdownRef : null}
                className="duration-300 transition-colors p-2 border border-[var(--nav-text)] cursor-pointer underline relative"
                onClick={() => toggleDropdown(user.id)}
            >
                {user.accountNumber || "-"}
                {isDropdownOpen && (
                    <div
                        className="absolute bg-[var(--nav-bg)] shadow-md p-2 mt-1 rounded z-50 w-48 border border-[var(--nav-text)] left-1/2 transform -translate-x-1/2"
                    >
                        <button
                            onClick={handleEditClickWrapper}
                            disabled={loadingRow.delete}
                            className={`block w-full text-left px-2 py-1 rounded text-sm font-bold border mb-1 ${loadingRow.delete ? "opacity-60 cursor-wait" : "bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)] duration-300 transition-colors"}`}
                        >
                            Edit User
                        </button>
                        <button
                            onClick={handleDeleteClickWrapper}
                            disabled={loadingRow.delete}
                            className={`block w-full text-left px-2 py-1 rounded text-sm mt-1 font-bold border ${loadingRow.delete ? "opacity-60 cursor-wait" : "border-[var(--danger-border)] bg-[var(--nav-text)] text-[var(--nav-bg)] hover:bg-[var(--danger-hover-bg)] duration-300 transition-colors"}`}
                        >
                            {loadingRow.delete ? "Deleting..." : "Delete User"}
                        </button>
                    </div>
                )}
            </td>
            <td className="p-2 border border-[var(--nav-text)] text-left duration-300 transition-colors">{user.fullName}</td>
            <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{user.email}</td>
            <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{user.accountType}</td>
            <td className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
        </tr>
    );
}

export default AdminUsersManagementPanelUsersTable;