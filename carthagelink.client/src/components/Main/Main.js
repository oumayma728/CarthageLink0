import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import "./Main.css";

export default function Main() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Retrieve the role from localStorage
    const role = localStorage.getItem("userRole");

    if (role) {
      setUserRole(role); // Set the role in state if it's available
    } else {
      console.log("No role found in localStorage"); // Log if role is not set
    }
  }, []);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="menu-button">
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button onClick={() => setIsOpen(false)} className="close-button">
          <X size={24} />
        </button>
        <ul>
          <a href="/User">
            <li>Users</li>
          </a>
          <a href="Device">
            <li>Devices</li>
          </a>
          <a href="/Factory">
            <li>Factories</li>
          </a>
        </ul>
      </div>
      <div className="carthageLink">
        Carthage Link
      </div>
      {/* Display the role */}
      {userRole ? (
        <div className="user-role">
          Welcome, {userRole}!
        </div>
      ) : (
        <div className="user-role">
          Welcome, Guest!
        </div>
      )}
    </div>
  );
}
