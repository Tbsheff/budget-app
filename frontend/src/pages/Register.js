import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const onChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/auth/register', formData);
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            alert(err.response.data.message || 'Error registering user');
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Register</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Name: </label>
                    <input name="name" value={formData.name} onChange={onChange} />
                </div>
                <div>
                    <label>Email: </label>
                    <input name="email" value={formData.email} onChange={onChange} />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        name="password"
                        value={formData.password}
                        onChange={onChange}
                        type="password"
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Register;
