import { useState, useEffect } from "react";
import { API } from "../../Services/APIs";

const useDashboardData = () => {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(API.dashboard.user, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setDashboard(data.dashboard);
      } catch (err) {
        console.error("Error fetching user dashboard:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return { dashboard, isLoading, error };
};

export default useDashboardData;