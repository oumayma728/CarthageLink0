import { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', loginData);
            alert(response.data.message);
            console.log('Token:', response.data.Token);
            // You can store the token in localStorage or context for further use
        } catch (error) {
            alert(error.response?.data || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Email:</label>
                <input type="email" name="email" value={loginData.email} onChange={handleChange} required />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" name="password" value={loginData.password} onChange={handleChange} required />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;