import { useState, useEffect, useContext, useMemo } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { API } from "../../Services/APIs";
import { ADMIN_DASHBAORD_CHART_DURATION } from "../../Data/Global_variables";

const createChartOptions = (colors) => ({
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: { color: colors.primary },
    },
    tooltip: {
      enabled: true,
      titleColor: colors.diagram_text,
      bodyColor: colors.diagram_text,
    },
  },
  scales: {
    x: {
      ticks: { color: colors.primary },
      grid: { color: colors.border },
      title: { color: colors.primary, display: true, text: "X Axis" },
    },
    y: {
      ticks: { color: colors.primary },
      grid: { color: colors.border },
      title: { color: colors.primary, display: true, text: "Y Axis" },
    },
  },
  animation: { duration: ADMIN_DASHBAORD_CHART_DURATION, easing: "easeOutBounce" },
});

export function useAdminDashboardData() {
  const { theme } = useContext(ThemeContext);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

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
        cardBg: "hsl(164, 50%, 90%)",
        border: "hsl(190, 80%, 20%)",
      };
    }
  }, [theme]);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await fetch(API.dashboard.admin, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setDashboard(data.dashboard);
      } catch (err) {
        console.error("Error fetching admin dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const chartData = useMemo(() => {
    if (!dashboard) return {};
    const chartOptions = createChartOptions(colors);
    const metrics = [
      { label: "Total Users", value: dashboard.totalUsers },
      { label: "Total Admins", value: dashboard.totalAdmins },
      { label: "Total Supervisors", value: dashboard.totalSupervisors },
      { label: "New Users (24h)", value: dashboard.usersLastDay },
      { label: "New Users (7 days)", value: dashboard.usersLast7Days },
      { label: "Total Transactions", value: dashboard.totalTransactions },
    ];
    const usersByRoleData = {
      labels: ["Users", "Admins", "Supervisors"],
      datasets: [{
        label: "Users by Role",
        data: [dashboard.totalUsers, dashboard.totalAdmins, dashboard.totalSupervisors],
        backgroundColor: [colors.primaryDigram, colors.secondary, colors.accent],
        borderColor: colors.primary,
        borderWidth: 1,
      }],
    };
    const newUsersData = {
      labels: ["Last 24h", "Last 7 days"],
      datasets: [{
        label: "New Users",
        data: [dashboard.usersLastDay, dashboard.usersLast7Days],
        backgroundColor: [colors.secondary, colors.accent],
        borderColor: colors.primary,
        borderWidth: 1,
      }],
    };
    const transactionsByTypeData = {
      labels: dashboard.transactionsByType.map(t => t._id),
      datasets: [{
        label: "Transactions by Type",
        data: dashboard.transactionsByType.map(t => t.count),
        backgroundColor: [colors.primaryDigram, colors.secondary, colors.accent],
        borderColor: colors.primary,
        borderWidth: 1,
      }],
    };
    const transactionsByStateData = {
      labels: dashboard.transactionsByState.map(t => t._id),
      datasets: [{
        label: "Transactions by State",
        data: dashboard.transactionsByState.map(t => t.count),
        backgroundColor: colors.accent,
        borderColor: colors.primary,
        borderWidth: 1,
      }],
    };

    return {
      metrics,
      usersByRoleData,
      newUsersData,
      transactionsByTypeData,
      transactionsByStateData,
      chartOptions,
    };
  }, [dashboard, colors]);

  return {
    dashboard,
    loading,
    colors,
    chartData,
  };
}