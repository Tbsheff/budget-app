import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="navbar">
            <div>
                <Link to="/">Budget Planner</Link>
            </div>
            <div>
                {token ? (
                    <>
                        <Link to="/dashboard">Dashboard</Link>
                        <Link to="/budget">Budget</Link>
                        <Link to="/savings">Savings</Link>
                        <Link to="/reports">Reports</Link>
                        <Link to="/settings">Settings</Link>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/">Home</Link>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Navbar;
