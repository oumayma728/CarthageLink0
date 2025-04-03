import { useState, useEffect, useCallback } from "react";

export default function useFactories() {
  const [fid, setFid] = useState(""); // State to store factory id
  const [factories, setFactories] = useState([]); // State to store list of factories
  const [isLoading, setIsLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(null); // Store any error messages

  // Fetch factories with useCallback to memoize the function
  const fetchFactories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://localhost:7086/api/Factory", {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setFactories(data); // Update the state with fetched factories
    } catch (err) {
      setError(err.message); // Set error message in state
      console.error("Fetch error:", err); // Log error to the console
    } finally {
      setIsLoading(false); // Set loading to false once fetch is complete
    }
  }, []); // Empty dependency array ensures this function doesn't get recreated

  // Function to delete a factory
  const deleteFactory = async (fid) => {
    try {
      const response = await fetch(`https://localhost:7086/api/Factory/${fid}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Delete failed");

      await response.json(); // Process the response after deletion
      fetchFactories(); // Refresh the list of factories after deletion
    } catch (err) {
      console.error("Error deleting factory:", err);
      alert("Failed to delete factory."); // Display alert if deletion fails
    }
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    fetchFactories();
  }, [fetchFactories]); // Only run once on mount because of empty dependency array

  return {
    fid,
    setFid,
    factories,
    isLoading,
    error,
    fetchFactories,
    deleteFactory,
  };
}
