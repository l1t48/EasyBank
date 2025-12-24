import { useEffect, useContext, useState } from "react";
import { useAuth } from "../../../Context/AuthContext";
import { ThemeContext } from "../../../Context/ThemeContext";
import Navbar from "../../General-Componenets/Navbar";
import Footer from "../../General-Componenets/Footer";
import Toast from "../../../Context/Toast";
import useDashboardData from "../../../Hooks/User-Hooks/useUserDashboardData";
import useThemedColors from "../../../Hooks/User-Hooks/useUserThemedColors";
import UserDashboardMetrics from "./UserDashboardMetrics";
import UserTransactionsCharts from "./UserTransactionsCharts";
import UserRecentTransactionsTable from "./UserRecentTransactionsTable";

function UserDashboardEntity() {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  const { dashboard, isLoading } = useDashboardData();
  const colors = useThemedColors(theme);

  useEffect(() => {
    setToastMsg(`Welcome ${user.firstName}`);
    setToastType("info");
    setShowToast(true);
  }, [user.firstName]);

  if (isLoading || !dashboard) return <p className="p-5">Loading dashboard...</p>;

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh" }}>
      <Navbar />
      <main className="main-content p-5 mt-5">
        <h1 style={{ color: colors.primary }} className="text-3xl lg:text-4xl font-bold mb-5 text-center p-5 duration-300 transition-colors">
          Welcome {user.firstName}, you are logged in as {user.accountType}
        </h1>
        <UserDashboardMetrics dashboard={dashboard} colors={colors} />

        <div style={{ backgroundColor: colors.cardBg, borderColor: colors.border }} className="p-5 rounded shadow border my-5">
          <UserTransactionsCharts totalsByType={dashboard.totalsByType} colors={colors} />
        </div>

        <div style={{ backgroundColor: colors.cardBg, borderColor: colors.border }} className="p-5 rounded shadow border">
          <UserRecentTransactionsTable recentTransactions={dashboard.recentTransactions} colors={colors} />
        </div>
      </main>

      <footer className="mt-10">
        <Footer />
      </footer>

      <Toast
        message={toastMsg}
        show={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default UserDashboardEntity;
