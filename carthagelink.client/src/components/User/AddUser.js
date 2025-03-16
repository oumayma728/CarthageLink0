import { useState } from "react";

export default function New() {
    const [entry, Setentry] = useState({
        Name: "",
        Email: "",
        Phone: "",
        Role: "",
        FactoryName: "",	
        LicenseKey: "",
        AssignedDevices: [] 
    });

    const addNewUser = () => {
        console.log("The New user is:", entry);

        fetch("https://localhost:7086/api/User/Super-admin/create-user", { 
            method: "POST", 
            body: JSON.stringify(entry), 
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((r) => {
            console.log("Response from backend for adding new User:", r);
            alert("User added successfully!"); 
            window.location = "/";
        })
        .catch((e) => console.log("Error adding new User:", e));
    };

    const newData = (e) => {
        const { name, value } = e.target;

        Setentry((prev) => ({
            ...prev,
            [name]: name === "AssignedDevices" ? value.split(",") : value, // Convert AssignedDevices to array
        }));

        console.log("The New User is:", entry);
    };

    return (
        <section className="new">
            <h1>Add New User</h1>

            <div>
                <label htmlFor="fn">Name</label>
                <input type="text" name="Name" id="fn" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="ln">Email</label>
                <input type="text" name="Email" id="ln" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="dp">Phone</label>
                <input type="text" name="Phone" id="dp" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="cn">Role</label>
                <input type="text" name="Role" id="cn" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="cn">Factory Name</label>
                <input type="text" name="FactoryName" id="cn" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="cn">License Key</label>
                <input type="text" name="LicenseKey" id="cn" onChange={newData} />
            </div>

            <div className="nw">
                <label htmlFor="cn">Assigned Devices (comma-separated)</label>
                <input type="text" name="AssignedDevices" id="cn" onChange={newData} />
            </div>

            <div className="new-30">
                <button className="btn cancel" onClick={() => window.location = "/"}>Cancel</button>
                <button className="btn-add" onClick={addNewUser}>Add</button>
            </div>
        </section>
    );
}
