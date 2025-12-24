import { useState, useEffect, useRef } from 'react';
import AdminUsersManagementPanelCreateUser from './AdminUsersManagementPanelCreateUser';
import AdminUsersManagementPanelSearchUser from './AdminUsersManagementPanelSearchUser';
import { DROPDOWN_MIN_WIDTH } from '../../../Data/Global_variables';

export default function AdminUsersManagementPanelMenu({ onUserCreated, children }) {
    const [isEllipsisHorizontal, setIsEllipsisHorizontal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [isSearchUserModalOpen, setIsSearchUserModalOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleEllipsisClick = () => {
        setIsEllipsisHorizontal((prev) => !prev);
        setDropdownOpen((prev) => !prev);
    };

    useEffect(() => {
        function onDocClick(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
                setIsEllipsisHorizontal(false);
            }
        }
        document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, []);

    const handleCreateUser = () => {
        setDropdownOpen(false);
        setIsEllipsisHorizontal(false);
        setIsCreateUserModalOpen(true);
    };
    const handleSearchUser = () => {
        setDropdownOpen(false);
        setIsEllipsisHorizontal(false);
        setIsSearchUserModalOpen(true);
    };
    const handleCloseCreateModal = () => {
        setIsCreateUserModalOpen(false);
    };
    const handleCloseSearchModal = () => {
        setIsSearchUserModalOpen(false);
    };

    return (
        <div className="w-full flex flex-col items-stretch px-4">
            <div className="w-full flex flex-row items-center justify-between gap-4 py-6">
                <h1 className="text-3xl font-bold text-[var(--nav-text)] duration-300 transition-colors">Users</h1>
                <div className="flex items-center gap-3">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={handleEllipsisClick}
                            aria-expanded={dropdownOpen}
                            aria-label={isEllipsisHorizontal ? 'Ellipsis horizontal' : 'Ellipsis vertical'}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] shadow-md transition"
                        >
                            <span className="sr-only">Menu</span>
                            <span className="text-xl select-none transform transition-transform duration-200">{isEllipsisHorizontal ? '⋮' : '⋯'}</span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-44 rounded shadow-md p-2 bg-[var(--nav-bg)] border border-[var(--nav-text)] z-50" style={{ minWidth: DROPDOWN_MIN_WIDTH }}>
                                <button
                                    onClick={handleCreateUser}
                                    className="block w-full text-left px-2 py-1 font-bold border border-[--bg] rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)]"
                                >
                                    Create a New User
                                </button>
                                <button
                                    onClick={handleSearchUser}
                                    className="block w-full text-left mt-2 px-2 py-1 font-bold border border-[--bg] rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)]"
                                >
                                    Search a User
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="w-full">
                {children}
            </div>
            
            <AdminUsersManagementPanelCreateUser
                isOpen={isCreateUserModalOpen}
                onClose={handleCloseCreateModal}
                onUserCreated={onUserCreated}
            />
            <AdminUsersManagementPanelSearchUser
                isOpen={isSearchUserModalOpen}
                onClose={handleCloseSearchModal}
            />
        </div>
    );
}