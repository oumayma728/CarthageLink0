import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "/Users/21699/source/repos/CarthageLink/carthagelink.client/src/assets/logo.png";
import "./Home.css";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="navbar">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        <a href="/register"> {/* Change to the desired route */}
          <img src={logo} alt="Logo" className="logo" />
        </a>      </div>

      <button onClick={() => setIsOpen(true)} className="menu-button">
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <button onClick={() => setIsOpen(false)} className="close-button">
          <X size={24} />
        </button>
        <ul>
          <li>Users</li>
          <li>Devices</li>
          <li>Factories</li>
        </ul>
      </div>
    </div>
  );
}
