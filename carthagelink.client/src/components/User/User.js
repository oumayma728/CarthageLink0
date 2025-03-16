import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Ensure you have installed lucide-react
import "./User.css";

export default function User() {
  const [uid, setUid] = useState("");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Added missing state for sidebar

  const handleModal = (hide) => {
    const deleteModal = document.querySelector(".delete-modal");
    if (deleteModal) {
      if (hide) {
        deleteModal.classList.add("hidden");
      } else {
        deleteModal.classList.remove("hidden");
      }
    }
  };

  const OpenDeleteModal = (id) => {
    setUid(id);
    handleModal(false);
  };

  const DeleteUser = () => {
    fetch("https://localhost:7086/api/User/" + uid, {
      method: "DELETE",
    })
      .then((r) => r.json())
      .then(() => {
        setUsers(users.filter((user) => user.id !== uid));
        handleModal(true);
        window.location.reload(); // Corrected the reload function
      })
      .catch((e) => {
        console.log("Error deleting a User", e);
      });
  };

  useEffect(() => {
    fetch("https://localhost:7086/api/User")
      .then((r) => r.json())
      .then((d) => {
        setUsers(d);
      })
      .catch((e) => console.log("Error fetching users:", e));
  }, []);

  return (
    <main>
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
          <a href="/Device">
            <li>Devices</li>
          </a>
          <a href="/Factory">
            <li>Factories</li>
          </a>
          <a href="/License">
            <li>Licenses</li>
        </a>
        </ul>
      </div>

      <h1>Users</h1>
      <div className="btn1">
        <a href="/AddUser">+</a>
      </div> {/* Fixed missing closing div */}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Factory Name</th>
            <th>License Key</th>
            <th>Assigned Devices</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="8" className="waiting">
                Loading...
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.role}</td>
                <td>{user.factoryname}</td>
                <td>{user.licenseKey}</td>
                <td>{user.assignedDevices}</td>
                <td>
                  <a href={`/Edit?id=${user.id}`}>Edit</a> |{" "}
                  <span
                    onClick={() => OpenDeleteModal(user.id)}
                    style={{ cursor: "pointer", color: "red" }}
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <section className="delete-modal hidden">
        <div className="modal-item">
          <h3>Delete User</h3>
          <p>Are you sure you want to delete this User?</p>
          <div className="row mt-20 justify-btw">
            <div className="btn cancel" onClick={() => handleModal(true)}>
              Cancel
            </div>
            <div className="btn add" onClick={DeleteUser}>
              Delete
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
