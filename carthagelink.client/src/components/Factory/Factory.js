import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Ensure you have installed lucide-react
import './Factory.css'

export default function Factory() {
  const [fid, setFid] = useState("");
  const [Factories, setFactories] = useState([]); // updated to lowercase `Factories`
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
    setFid(id);
    handleModal(false); // Open the modal
  };

  const DeleteFactory = () => {
    console.log("Deleting factory with ID:", fid); // Ensure ID is correct
    fetch("https://localhost:7086/api/Factory/" + fid, {
      method: "DELETE",
    })
      .then((r) => {
        if (!r.ok) {
          throw new Error('Delete failed');
        }
        return r.json();
      })
      .then(() => {
        handleModal(true); // Hide the modal
      })
      .catch((e) => {
        console.log("Error deleting a Factory", e);
        alert("Failed to delete factory.");
      });
  };
  
  

  useEffect(() => {
    fetch("https://localhost:7086/api/Factory", {
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Factories fetched:", data);
      setFactories(data);
    })
    .catch(error => console.error("Fetch error:", error));
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
      <h1>Factories</h1>
      <div className="btn1">
        <a href="/add-factory">Add Factory</a>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Tax Number</th>
            <th>Location</th>
            <th>Factory Email</th>
            <th>License Key</th>
            <th>Assigned Devices</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Factories.length === 0 ? (
            <tr>
              <td colSpan="8" className="waiting">
                Loading...
              </td>
            </tr>
          ) : (
            Factories.map((factory) => (
              <tr key={factory.id}>
                <td>{factory.name}</td>
                <td>{factory.description}</td>
                <td>{factory.taxNumber}</td>
                <td>{factory.location}</td>
                <td>{factory.factoryEmail}</td>
                <td>{factory.licenseKey}</td>
                <td>{factory.assignedDevices.join(", ")}</td>
                <td>
                  <a href={`/Edit?id=${factory.id}`}>Edit</a> |{" "}
                  <span
                    onClick={() => OpenDeleteModal(factory.id)}
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
          <h3>Delete Factory</h3>
          <p>Are you sure you want to delete this Factory?</p>
          <div className="row mt-20 justify-btw">
            <div className="btn cancel" onClick={() => handleModal(true)}>
              Cancel
            </div>
            <div className="btn add" onClick={DeleteFactory}>
              Delete
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
