import  { useState } from 'react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Operator', // Default role
        licenseKey: '' // Optional: If you want users to input a license key
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7086/api/User/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                const errorData = await response.json(); // Parse error response
                throw new Error(errorData.message || 'Registration failed');
            }
    
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error:', error); // Log the error to the console
            alert(error.message || 'Registration failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Phone:</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div>
                <label>Role:</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="SuperAdmin">Super Admin</option>
                    <option value="FactoryAdmin">Factory Admin</option>
                    <option value="Operator">Operator</option>
                </select>
            </div>
            {/* Optional: If you want users to input a license key */}
            { <div>
                <label>License Key:</label>
                <input type="text" name="licenseKey" value={formData.licenseKey} onChange={handleChange} />
            </div> }
            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;