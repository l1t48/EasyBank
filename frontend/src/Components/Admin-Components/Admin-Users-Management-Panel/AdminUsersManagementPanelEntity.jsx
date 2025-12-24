import { useState, useRef, useEffect } from "react";
import { useUserManagement } from "../../../Hooks/User-Hooks/useUserManagement";
import AdminUsersManagementPanelUsersMobileCards from "./AdminUsersManagementPanelUsersMobileCards";
import AdminUsersManagementPanelUsersTable from "./AdminUsersManagementPanelUsersTable";
import AdminUsersManagementPanelEditUser from "./AdminUsersManagementPanelEditUser";
import { TABLE_COLUMN_COUNT_USER_MANAGEMENT } from "../../../Data/Global_variables";

function AdminUsersManagementPanelEntity() {
    const { 
        users, 
        loading, 
        actionLoading, 
        handleDeleteUser, 
        handleUserUpdated 
    } = useUserManagement();
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (id) => setDropdownOpen(dropdownOpen === id ? null : id);

    const handleEditUserClick = (user) => {
        setUserToEdit(user);
        setIsEditModalOpen(true);
        setDropdownOpen(null);
    };
    const handleDeleteClick = (user) => {
        setDropdownOpen(null);
        handleDeleteUser(user);
    };

    if (loading) return <p className="text-center text-[var(--nav-text)] mt-5">Loading...</p>;

    return (
        <div className="mt-5 w-full px-2 sm:px-4">
            <div className="xl:hidden space-y-3">
                {users.length === 0 ? (
                    <p className="text-center text-[var(--nav-text)]">No users found.</p>
                ) : (
                    users.map((u) => (
                        <AdminUsersManagementPanelUsersMobileCards
                            key={u.id}
                            user={u}
                            loadingRow={actionLoading[u.id] || {}}
                            onEditClick={handleEditUserClick}
                            onDeleteClick={handleDeleteClick}
                        />
                    ))
                )}
            </div>
            <div className="hidden xl:block">
                <div className="p-5">
                    <table className="min-w-full table-auto font-bold border text-[var(--nav-text)] border-[var(--nav-text)] text-sm md:text-base">
                        <thead className="bg-[var(--nav-bg)]">
                            <tr>
                                <th className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">Account Number</th>
                                <th className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">Full Name</th>
                                <th className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">Email</th>
                                <th className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">Account Type</th>
                                <th className="p-2 border border-[var(--nav-text)] duration-300 transition-colors">Created</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={TABLE_COLUMN_COUNT_USER_MANAGEMENT} className="p-3 border text-center border-[var(--nav-text)]">
                                        No users.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u) => (
                                    <AdminUsersManagementPanelUsersTable
                                        key={u.id}
                                        user={u}
                                        loadingRow={actionLoading[u.id] || {}}
                                        dropdownOpen={dropdownOpen}
                                        toggleDropdown={toggleDropdown}
                                        dropdownRef={dropdownRef}
                                        onEditClick={handleEditUserClick}
                                        onDeleteClick={handleDeleteClick}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <AdminUsersManagementPanelEditUser
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={userToEdit} 
                onUserUpdated={handleUserUpdated}
            />
        </div>
    );
}

export default AdminUsersManagementPanelEntity;