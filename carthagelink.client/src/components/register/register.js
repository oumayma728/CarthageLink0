import  { useState } from 'react';
import './register.css'
const RegisterForm = () => {
    //creates a state variable to store the user's input.
    //formData stores all the user’s input values.
    //setFormData is a function that updates formData when the user types something.

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'FactoryAdmin', 
        licenseKey: ''
    });

//This function runs when the user types in the form.
    const handleChange = (e) => {
        //e.target refers to the input field where the user is typing.
        const { name, value } = e.target;
        //setFormData({...}) updates formData with the new input.
        setFormData({
            ...formData,
            [name]: value
        });
    };
//This function runs when the user clicks the "Register" button.
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("https://localhost:7086/api/User/register-user", { //used to send data to a server.
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Error:', errorData); // Log server error
                throw new Error(errorData.message || 'Registration failed');
            }
    
            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Fetch Error:', error); // Log fetch error
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
                    <option value="FactoryAdmin">Factory Admin</option>
                </select>
            </div>
            <div>
                <label>License Key:</label>
                <input type="text" name="licenseKey" value={formData.licenseKey} onChange={handleChange} />
            </div> 
            <div>
                <a href='/login'>Already have an account?</a>
       </div>
       <a href="/main">
        <button className="main"> Register</button>
      </a>

        </form>
    );
};

export default RegisterForm;