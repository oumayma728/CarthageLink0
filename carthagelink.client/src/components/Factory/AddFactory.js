import { useState } from "react";

export default function AddFactory() {
    const [entry, Setentry] = useState({
        Name: "",
        Description: "",
        TaxNumber: "",
        Location: "",
        FactoryEmail: "",
        AssignedDevices: [] 
    });

    const addNewFactory = () => {
        console.log("Factory is:", entry);

        fetch("https://localhost:7086/api/Factory", { 
            method: "POST", 
            body: JSON.stringify(entry), 
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to add factory');
            }
            return response.json();
        })
        .then((data) => {
            console.log("Response from backend for adding new Factory:", data);
            alert("Factory added successfully!");
            window.location = "/";
        })
        .catch((e) => {
            console.log("Error adding new Factory:", e);
            alert("Failed to add Factory. Please try again later.");
        });
    };

    const newData = (e) => {
        const { name, value } = e.target;

        Setentry((prev) => ({
            ...prev,
            [name]: name === "AssignedDevices" ? (value ? value.split(",") : []) : value, 
        }));

        console.log("The New Factory is:", entry);
    };

    return (
        <section className="new">
            <h1>Add New Factory</h1>

            <div>
                <label htmlFor="fn">Name</label>
                <input type="text" name="Name" id="fn" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="ln">Description</label>
                <input type="text" name="Description" id="ln" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="dp">TaxNumber</label>
                <input type="text" name="TaxNumber" id="dp" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="cn">Location</label>
                <input type="text" name="Location" id="cn" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="cn">FactoryEmail</label>
                <input type="text" name="FactoryEmail" id="cn" onChange={newData} />
            </div>
            <div className="nw">
                <label htmlFor="cn">Assigned Devices (comma-separated)</label>
                <input type="text" name="AssignedDevices" id="cn" onChange={newData} />
            </div>

            <div className="new-30">
                <button className="btn cancel" onClick={() => window.location = "/"}>Cancel</button>
                <button className="btn-add" onClick={addNewFactory}>Add</button>
            </div>
        </section>
    );
}
