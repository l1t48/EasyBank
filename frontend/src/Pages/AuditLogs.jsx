import { useAuth } from "../Context/AuthContext";
import ErrorModule from "./ErrorModule";
import Navbar from "../Components/General-Componenets/Navbar";
import AdminAuditLogsEntity from "../Components/Admin-Components/Admin-AuditLogs/AdminAuditLogsEntity";
import SupervisorAuditLogsEntity from "../Components/Supervisor-Components/Supervisor-AuditLogs/SupervisorAuditLogsEntity";

function AuditLogs() {
   const { user } = useAuth();
    if (!user) return <div>Loading...</div>;

    switch (user.accountType) {
        case "Admin":
            return (
                <div>
                    <Navbar />
                    <div className="main-content w-full h-fit mt-5">
                        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
                            <AdminAuditLogsEntity />
                        </div>
                    </div>
                </div>
            );

        case "Supervisor":
            return (
                <div>
                    <Navbar />
                    <div className="main-content w-full h-fit mt-5">
                        <div className="flex flex-col items-center px-4 sm:px-6 lg:px-8">
                            <SupervisorAuditLogsEntity />
                        </div>
                    </div>
                </div>
            );
        default:
            return <ErrorModule type="unauthorized" />;
    }
}

export default AuditLogs