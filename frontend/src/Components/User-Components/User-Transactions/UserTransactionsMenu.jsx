import { useState, useEffect, useRef } from 'react';
import UserTransactionsCreateNewTransaction from "./UserTransactionsCreateNewTransaction";
import Filter_options_user from "./UserTransactionsFilteringOptions";
import { USER_TRANSACTIONS_MENU } from '../../../Data/Global_variables';

export default function UserTransactionsMenu({ activeFilters, setActiveFilters }) {
    const [isEllipsisHorizontal, setIsEllipsisHorizontal] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

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

    const handleCreateTransaction = () => {
        setIsModalOpen(true);
        setDropdownOpen(false);
        setIsEllipsisHorizontal(false); 
    };

    const handleOpenFilters = () => {
        setIsFilterModalOpen(true); 
        setDropdownOpen(false); 
        setIsEllipsisHorizontal(false); 
    };
    
    const handleApplyFilters = (filters) => {
        setActiveFilters(filters);
    };


    return (
        <div className="w-full flex flex-col items-stretch px-4 sm:px-6 lg:px-8">
            <div className="w-full flex flex-row items-center justify-between gap-4 py-6">
                <h1 className="text-3xl font-bold text-[var(--nav-text)] duration-300 transition-colors">Transactions</h1>
                <div className="flex items-center gap-3">
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={handleEllipsisClick}
                            aria-expanded={dropdownOpen}
                            aria-label={isEllipsisHorizontal ? 'Menu horizontal' : 'Menu vertical'}
                            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:border hover:border-[var(--nav-hover)] shadow-md transition"
                        >
                            <span className="sr-only">Menu</span>
                            <span className="text-xl select-none transform transition-transform duration-200">
                                {dropdownOpen ? '⋮' : '⋯'}
                            </span>
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-1 w-40 rounded shadow-md p-2 bg-[var(--nav-bg)] border border-[var(--nav-text)] z-50" style={{ minWidth: USER_TRANSACTIONS_MENU }}>
                                
                                <button
                                    onClick={handleCreateTransaction}
                                    className="block w-full text-left px-2 py-1 font-bold rounded text-sm bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)] border border-[--bg]"
                                >
                                    Create a New Transaction
                                </button>

                                <button
                                    onClick={handleOpenFilters}
                                    className="block w-full text-left px-2 py-1 font-bold rounded text-sm mt-1 bg-[var(--nav-text)] text-[var(--nav-bg)] hover:text-[var(--nav-text)] hover:bg-[var(--nav-bg)] border border-[--bg]"
                                >
                                    Filtering Options
                                </button>
                                
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full grid gap-6">
                {Object.keys(activeFilters).length > 0 && (
                    <div className="p-3 bg-[var(--nav-bg)] text-[var(--nav-text)] rounded shadow border border-dashed border-[var(--nav-hover)]">
                        <span className="font-semibold">Active Filters:</span> {JSON.stringify(activeFilters)}
                    </div>
                )}
            </div>

            <UserTransactionsCreateNewTransaction
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            
            <Filter_options_user
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
}