import { useAuth } from "../Context/AuthContext";
import ErrorModule from "./ErrorModule";
import Navbar from "../Components/General-Componenets/Navbar";
import UserTransactionsMenu from "../Components/User-Components/User-Transactions/UserTransactionsMenu";
import UserTransactionsEntity from "../Components/User-Components/User-Transactions/UserTransactionsEntity";
import Transaction_table_supervisor from "../Components/Supervisor-Components/Supervisor-Transactions/SupervisorTransactionsEntity";
import Transaction_menu_supervisor from "../Components/Supervisor-Components/Supervisor-Transactions/SupervisorTransactionsMenu";
import Transaction_menu_admin from "../Components/Admin-Components/Admin-Transactions/AdminTransactionsMenu";
import { useState } from "react";

function TransactionOperations() {
    const { user } = useAuth();
    if (!user) return <div>Loading...</div>;

    switch (user.accountType) {
        case "Admin":
            const [activeFilterAdmins, setActiveFiltersAdmin] = useState({});
            return (
                <div>
                    <Navbar />
                    <div className="main-content w-full h-fit mt-5">
                        <div className="flex flex-col items-center">
                            <Transaction_menu_admin
                                activeFilters={activeFilterAdmins}
                                setActiveFilters={setActiveFiltersAdmin}
                            />
                        </div>

                    </div>
                </div>

            );

        case "Supervisor":
            const [activeFilterSupervisor, setActiveFiltersSupervisor] = useState({});
            return (
                <div>
                    <Navbar />
                    <div className="main-content w-full h-fit mt-5">
                        <div className="flex flex-col items-center">
                            <Transaction_menu_supervisor
                                activeFilters={activeFilterSupervisor}
                                setActiveFilters={setActiveFiltersSupervisor} />
                            <Transaction_table_supervisor filters={activeFilterSupervisor} />
                        </div>
                    </div>
                </div>

            );

        case "User":
            const [activeFilters, setActiveFilters] = useState({});
            return (
                <div>
                    <Navbar />
                    <div className="main-content w-full h-fit mt-5">
                        <div className="flex flex-col items-center">
                            <UserTransactionsMenu
                                activeFilters={activeFilters}
                                setActiveFilters={setActiveFilters}
                            />
                            <UserTransactionsEntity filters={activeFilters} />
                        </div>
                    </div>
                </div>
            );

        default:
            return <ErrorModule type="unauthorized" />;
    }
}

export default TransactionOperations;
