import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // Ensure you have installed lucide-react
import './License.css'

export default function License() {
    const [lid, setLid] = useState("");
    const [Licenses, setLicenses] = useState([]); // updated to lowercase `Factories`
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
    setLid(id);
      handleModal(false); // Open the modal
    };

    const DeleteLicense = () => {
    console.log("Deleting factory with ID:", lid); 
    fetch("https://localhost:7086/api/License/" + lid, {
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
        console.log("Error deleting a License", e);
        alert("Failed to delete License.");
        });
    };
    
    

    useEffect(() => {
    fetch("https://localhost:7086/api/License", {
        mode: "cors",
        headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("Factories fetched:", data);
        setLicenses(data);
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
        <a href="/License">
            <li>Licenses</li>
        </a>
        </ul>
    </div>
    <h1>Licenses</h1>
    <div className="btn1">
        <a href="/AddLicense">+</a>
    </div>

    <table>
        <thead>
        <tr>
            <th>Key</th>
            <th>Assinged To</th>
            <th>Devices</th>
            <th> Status</th>
            <th>CreatedAt</th>
            <th>expiresAt</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {Licenses.length === 0 ? (
            <tr>
            <td colSpan="8" className="waiting">
                Loading...
            </td>
            </tr>
        ) : (
            Licenses.map((License) => (
            <tr key={License.id}>
                <td>{License.key}</td>
                <td>{License.assignedTo}</td>
                <td>{License.devices}</td>
                <td>{License.status}</td>
                <td>{License.createdAt}</td>
                <td>{License.expiresAt}</td>

                <td>
            <a href={`/Edit?id=${License.id}`}>Edit</a> |{" "}
                <span
                    onClick={() => {
            OpenDeleteModal(License.id);
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
        <h3>Delete License</h3>
        <p>Are you sure you want to delete this License?</p>
        <div className="row mt-20 justify-btw">
            <div className="btn cancel" onClick={() => handleModal(true)}>
            Cancel
            </div>
            <div className="btn add" onClick={DeleteLicense}>
            Delete
            </div>
        </div>
        </div>
    </section>
    </main>
);
}
