import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Ensure you have installed lucide-react
import './Device.css'

export default function Device() {
    const [did, setDid] = useState("");
    const [Devices, setDevices] = useState([]); // updated to lowercase `Factories`
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
    setDid(id);
      handleModal(false); // Open the modal
    };

    const DeleteDevice = () => {
    console.log("Deleting factory with ID:", did); 
    fetch("https://localhost:7086/api/Device/" + did, {
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
        console.log("Error deleting a Device", e);
        alert("Failed to delete Device.");
        });
    };
    
    

    useEffect(() => {
    fetch("https://localhost:7086/api/Device", {
        mode: "cors",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Factories fetched:", data);
        setDevices(data);
    })
    .catch(error => console.error("Fetch error:", error));
    }, []);
    

return (
    <main>
    <button onClick={() => setIsOpen(true)} className="menu-button">
        <Menu size={24} />
    </button>

      {/* Sidebar */}
    <div className={`Sidebar ${isOpen ? "open" : ""}`}>
        <button onClick={() => setIsOpen(false)} className="close-button">
        <X size={24} />
        </button>
        <ul>
        <a href="/User">
            <li>Users</li>
        </a>
        <a href="/Factory">
            <li>Factories</li>
        </a>
        <a href="/Device">
            <li>Devices</li>
        </a>
        </ul>
    </div>
    <h1>Devices</h1>
    <div className="btn1">
        <a href="/AddDevice">+</a>
    </div>

    <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>MacAddress</th>
            <th> Status</th>
            <th> AssignedUsers</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {Devices.length === 0 ? (
            <tr>
            <td colSpan="8" className="waiting">
                Loading...
            </td>
            </tr>
        ) : (
            Devices.map((Device) => (
            <tr key={Device.id}>
                <td>{Device.name}</td>
                <td>{Device.MacAddress}</td>
                <td>{Device.Status}</td>
                <td>{Device.AssignedUsers}</td>
                <td>
            <a href={`/Edit?id=${Device.id}`}>Edit</a> |{" "}
                <span
                    onClick={() => {
            OpenDeleteModal(Device.id);
                    }}
                    style={{ cursor: "pointer", color: "red" }}>
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
        <h3>Delete Device</h3>
        <p>Are you sure you want to delete this Device?</p>
        <div className="row mt-20 justify-btw">
            <div className="btn cancel" onClick={() => handleModal(true)}>
            Cancel
            </div>
            <div className="btn add" onClick={DeleteDevice}>
            Delete
            </div>
        </div>
        </div>
    </section>
    </main>
);
}
