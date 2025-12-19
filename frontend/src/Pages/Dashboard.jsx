import { useAuth } from "../Context/AuthContext";
import AdminDashboardEntity from "../Components/Admin-Components/Admin-Dashboard/AdminDashboardEntity";
import SupervisorDashboard from "../Components/Supervisor-Components/Supervisor-Dashboard/SupervisorDashboardEntity";
import UserDashboardEntity from "../Components/User-Components/User-Dashboard/UserDashboardEntity";
import ErrorModule from "./ErrorModule";


function Dashboard(){
    const { user } = useAuth();
    if (!user) 
        return <div>Loading...</div>;

    switch (user.accountType) {
        case "Admin":
            return <AdminDashboardEntity />;
        case "Supervisor":
            return <SupervisorDashboard />;
        case "User":
            return <UserDashboardEntity />;
        default:
            return <ErrorModule type="unauthorized" />;
    }
}

export default Dashboard