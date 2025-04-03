import { useState } from "react";

export default function AddFactory() {
    const [entry, setEntry] = useState({
        Name: "",
        Description: "",
        TaxNumber: "",
        Location: "",
        FactoryEmail: "",
        AssignedDevices: [] 
    });

    const addNewFactory = () => {
        fetch("https://localhost:7086/api/Factory", { 
            method: "POST", 
            body: JSON.stringify(entry), 
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to add factory');
            return response.json();
        })
        .then(() => {
            alert("Factory added successfully!");
            window.location = "/";
        })
        .catch((e) => {
            console.error("Error adding new Factory:", e);
            alert("Failed to add Factory. Please try again later.");
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEntry(prev => ({
            ...prev,
            [name]: name === "AssignedDevices" ? (value ? value.split(",") : []) : value, 
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6 sm:p-14">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Add New Factory</h1>
                        <p className="mt-1 text-sm text-gray-500">Fill in the details below to register a new factory</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Factory Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="Name"
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter factory name"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <input
                                type="text"
                                id="description"
                                name="Description"
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter description"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="taxNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tax Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="taxNumber"
                                    name="TaxNumber"
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter tax number"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="location"
                                    name="Location"
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter location"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Factory Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="FactoryEmail"
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter factory email"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="devices" className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned Devices
                            </label>
                            <input
                                type="text"
                                id="devices"
                                name="AssignedDevices"
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter device IDs separated by commas"
                            />
                            <p className="mt-1 text-xs text-gray-500">Example: DEV001,DEV002,DEV003</p>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-3">
                        <button
                            onClick={() => window.location = "/"}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={addNewFactory}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add Factory
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}