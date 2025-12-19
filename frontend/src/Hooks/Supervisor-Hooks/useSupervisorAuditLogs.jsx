import { useState, useEffect } from "react";
import { API } from "../../Services/APIs";
import { WANTED_LIMIT_IN_USE_AUDITLOGS_DATA } from "../../Data/Global_variables";

const wantedLimit = WANTED_LIMIT_IN_USE_AUDITLOGS_DATA;
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export function useAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilters, setCurrentFilters] = useState({});

  const fetchLogs = async (filters = {}) => {
    setLoading(true);
    setError(null);
    setCurrentFilters(filters);

    try {
      const query = new URLSearchParams({ limit: wantedLimit, ...filters }).toString();

      const res = await fetch(`${API.supervisor.auditLogs}?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || `Failed to fetch logs (Status: ${res.status})`);
      }

      setLogs(Array.isArray(json) ? json : json.logs || []);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError(err.message || "An unknown error occurred while fetching logs.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLogs().catch((e) => console.warn('Initial fetch failed', e));
    else {
      setLoading(false);
      setError("Authentication token not found.");
    }
  }, []);

  const refreshLogs = () => fetchLogs(currentFilters);

  return {
    logs,
    loading,
    error,
    fetchLogs,
    refreshLogs,
    currentFilters,
  };
}