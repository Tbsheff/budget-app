import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const onChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            alert(err.response.data.message || 'Error logging in');
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Login</h1>
            <form onSubmit={onSubmit}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
