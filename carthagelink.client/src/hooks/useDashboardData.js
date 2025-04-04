import { useState, useEffect, useCallback } from "react";

export default function useDashboardData() {
  const [data, setData] = useState({
    devices: 0,
    factories: 0,
    users: 0,
    licenses: 0,
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://localhost:7086/api/Dashboard/counts');
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const result = await response.json();
      setData({
        devices: result.devices || 0,
        factories: result.factories || 0,
        users: result.users || 0,
        licenses: result.licenses || 0,
        recentActivities: result.recentActivities || []
      });
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, loading, error, lastUpdated, refreshData: fetchData };
}