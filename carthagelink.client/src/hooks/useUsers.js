import { useState, useEffect, useCallback } from "react";

export default function useUsers() {
    //const [uid, setUid] = useState(""); // State to store factory id

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch("https://localhost:7086/api/User", {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setUsers(data); // Update the state with fetched factories
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err); // Log error to the console

    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteUser = async (uid) => {
    try {
      const response = await fetch(`https://localhost:7086/api/User/${uid}`, {
        method: "DELETE",
    });

        if (!response.ok) throw new Error("Delete failed");

        await response.json(); // Process the response after deletion
        fetchUsers(); // Refresh the list of factories after deletion
      } catch (err) {
        console.error("Error deleting factory:", err);
        alert("Failed to delete factory."); // Display alert if deletion fails
      }
    };
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    fetchUsers,
    deleteUser
  };
}