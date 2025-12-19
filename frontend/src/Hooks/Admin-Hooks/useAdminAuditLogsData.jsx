import { useEffect, useState, useCallback } from "react";
import { API } from "../../Services/APIs";
import { WANTED_LIMIT_IN_USE_AUDITLOGS_DATA } from "../../Data/Global_variables";

const wantedLimit = WANTED_LIMIT_IN_USE_AUDITLOGS_DATA;
const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

export function useAuditLogsData() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  
  const toggleExpandedId = (id) => setExpandedId(expandedId === id ? null : id);

  const fetchLogs = useCallback(async (filters = {}) => {
    if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams({ limit: wantedLimit, ...filters }).toString();

      const res = await fetch(`${API.admin.auditLogs}?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errJson = await res.json();
        throw new Error(errJson.error || `HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      setLogs(Array.isArray(json) ? json : json.logs || []);
    } catch (err) {
      setError(err.message || "Unknown error occurred while fetching logs.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    fetchLogs().catch((e) => console.warn('Initial audit log fetch failed', e));
  }, [fetchLogs]);

  return {
    logs,
    loading,
    error,
    expandedId,
    toggleExpandedId,
    fetchLogs,
  };
}