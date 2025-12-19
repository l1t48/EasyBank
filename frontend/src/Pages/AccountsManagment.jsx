import { useAuth } from "../Context/AuthContext";
import ErrorModule from "./ErrorModule";
import Navbar from "../Components/General-Componenets/Navbar";
import AdminUsersManagementPanelEntity from "../Components/Admin-Components/Admin-Users-Management-Panel/AdminUsersManagementPanelEntity";
import AdminUsersManagementPanelMenu from "../Components/Admin-Components/Admin-Users-Management-Panel/AdminUsersManagementPanelMenu";

function Accounts_managment() {
    const { user } = useAuth();
    if (!user) return <div>Loading...</div>;

    switch (user.accountType) {
        case "Admin":
            return (
                <div>
                    <Navbar />
                    <div className="main-content w-full h-fit mt-5">
                        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
                            <AdminUsersManagementPanelMenu />
                            <AdminUsersManagementPanelEntity />
                        </div>
                    </div>
                </div>
            );
        default:
            return <ErrorModule type="unauthorized" />;
    }
}

export default Accounts_managment