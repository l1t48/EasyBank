import { useEffect, useState, useContext } from "react";

import { useAuth } from "../../../Context/AuthContext";
import { ThemeContext } from "../../../Context/ThemeContext";

import Navbar from "../../General-Componenets/Navbar";
import Toast from "../../../Context/Toast";
import Footer from "../../General-Componenets/Footer";
import AdminDashboardMetrics from "./AdminDashboardMetrics";
import AdminDashboardCharts from "./AdminDashboardCharts";

import { useAdminDashboardData } from "../../../Hooks/Admin-Hooks/useAdminDashboardViewData";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


function AdminDashboardEntity() {
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  
  const { dashboard, loading, colors, chartData } = useAdminDashboardData();
  const { metrics, usersByRoleData, newUsersData, transactionsByTypeData, transactionsByStateData, chartOptions } = chartData;

  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");
  
  useEffect(() => {
    if (user.firstName) {
        setToastMsg(`Welcome ${user.firstName}`);
        setToastType("info");
        setShowToast(true);
    }
  }, [user.firstName]);

  if (loading || !dashboard) return <p className="p-5">Loading dashboard...</p>;

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh" }}>
      <Navbar />
      <main className="main-content p-5 mt-5">
        <h1 style={{ color: colors.primary }} className="duration-300 transition-colors text-3xl lg:text-4xl font-bold mb-5 text-center p-5">
          Welcome {user.firstName}, you are logged in as {user.accountType}
        </h1>

        <AdminDashboardMetrics metrics={metrics} colors={colors} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-5">
          <AdminDashboardCharts
            title="Users by Role"
            data={usersByRoleData}
            options={chartOptions}
            chartType="Doughnut"
            colors={colors}
          />

          <AdminDashboardCharts
            title="New Users"
            data={newUsersData}
            options={chartOptions}
            chartType="Bar"
            colors={colors}
          />

          <AdminDashboardCharts
            title="Transactions by Type"
            data={transactionsByTypeData}
            options={chartOptions}
            chartType="Pie"
            colors={colors}
          />

          <AdminDashboardCharts
            title="Transactions by State"
            data={transactionsByStateData}
            options={chartOptions}
            chartType="Bar"
            isHorizontal={true}
            colors={colors}
          />
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

export default AdminDashboardEntity;