import { useState, useEffect, useContext, useMemo } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import useDashboardData from "../../../Hooks/Supervisor-Hooks/useSupervisorDashboardData";
import Navbar from "../../General-Componenets/Navbar";
import Toast from "../../../Context/Toast";
import Footer from "../../General-Componenets/Footer";
import SupervisorDashboardMetrics from "./SupervisorDashboardMetrics";
import SupervisorDashboardCharts from "./SupervisorDashboardCharts";

function SupervisorDashboard() {
  const { dashboard, isLoading, error, user } = useDashboardData();
  const { theme } = useContext(ThemeContext);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");

  const colors = useMemo(() => {
    if (theme === "dark") {
      return {
        primary: "#44bc70",
        primaryDigram: "#41644A",
        diagram_text: "#44bc70",
        secondary: "#84994F",
        accent: "#CBD99B",
        bg: "#17171b",
        cardBg: "#1b1b21",
        border: "#44bc70",
      };
    } else {
      return {
        primary: "hsl(190, 80%, 20%)",
        primaryDigram: "#213555",
        diagram_text: "white",
        secondary: "#FD7979",
        accent: "#7ADAA5",
        bg: "hsl(172, 50%, 90%)",
        cardBg: "hsl(184, 61%, 86%)",
        border: "hsl(190, 80%, 20%)",
      };
    }
  }, [theme]);

  useEffect(() => {
    if (user && user.firstName) {
      setToastMsg(`Welcome ${user.firstName}`);
      setToastType("info");
      setShowToast(true);
    }
  }, [user]);
  
  if (isLoading) return <p className="p-5">Loading dashboard...</p>;
  if (error) return <p className="p-5" style={{ color: "red" }}>Error: {error}</p>;
  if (!dashboard) return <p className="p-5">No dashboard data available.</p>;

  return (
    <div style={{ backgroundColor: colors.bg, minHeight: "100vh" }}>
      <Navbar />
      <main className="main-content p-5 mt-5">
        <h1 style={{ color: colors.primary }} className="text-3xl lg:text-4xl font-bold mb-5 text-center p-5 duration-300 transition-colors">
          Welcome {user.firstName}, you are logged in as {user.accountType}
        </h1>

        <SupervisorDashboardMetrics dashboard={dashboard} colors={colors} /> 
        <SupervisorDashboardCharts dashboard={dashboard} colors={colors} />

        <div className="p-5">
          <h2 style={{ color: colors.primary }} className="text-xl font-semibold mb-3 duration-300 transition-colors">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table style={{ color: colors.primary, borderColor: colors.border }} className="min-w-full text-left font-bold border duration-300 transition-colors">
              <thead style={{ backgroundColor: colors.cardBg }}>
                <tr>
                  <th className="px-4 py-2 border" style={{ borderColor: colors.border }}>User</th>
                  <th className="px-4 py-2 border" style={{ borderColor: colors.border }}>Account #</th>
                  <th className="px-4 py-2 border" style={{ borderColor: colors.border }}>Type</th>
                  <th className="px-4 py-2 border" style={{ borderColor: colors.border }}>State</th>
                  <th className="px-4 py-2 border" style={{ borderColor: colors.border }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.recentTransactions.map(t => (
                  <tr key={t._id} style={{ backgroundColor: colors.cardBg }}>
                    <td className="px-4 py-2 border" style={{ borderColor: colors.border }}>{t.userId ? `${t.userId.firstName} ${t.userId.lastName}` : "N/A"}</td>
                    <td className="px-4 py-2 border" style={{ borderColor: colors.border }}>{t.userId ? t.userId.accountNumber : "N/A"}</td>
                    <td className="px-4 py-2 border" style={{ borderColor: colors.border }}>{t.transactionType}</td>
                    <td className="px-4 py-2 border" style={{ borderColor: colors.border }}>{t.state}</td>
                    <td className="px-4 py-2 border" style={{ borderColor: colors.border }}>{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default SupervisorDashboard;
