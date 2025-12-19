import { useState, useEffect } from "react";
import { useAuth } from "../../Context/AuthContext";
import { API } from "../../Services/APIs";

const useDashboardData = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(API.dashboard.supervisor, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setDashboard(data.dashboard);
      } catch (err) {
        console.error("Error fetching supervisor dashboard:", err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return { dashboard, isLoading, error, user };
};

export default useDashboardData;