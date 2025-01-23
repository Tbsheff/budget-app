import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';


function Navbar() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div>
            <nav className="nav nav--desk nav--primary">
                <div className="nav__products">
                    <ul role="list">
                        <li><Link to="/dashboard">Dashboard</Link></li>
                        <li><Link to="/budget">Budget</Link></li>
                        <li><Link to="/savings">Savings</Link></li>
                        <li><Link to="/reports">Reports</Link></li>
                    </ul>
                </div>
                <div className="nav__logo">
                    <Link to="/" title="Go to home - Budget Planner">
                        <img src="/images/walit-logo.png" alt="Budget Planner" />
                    </Link>
                </div>
                <div className="nav__cta">
                    <div className="nav__ctabox">
                        <ul role="list">
                            {token ? (
                                <>
                                    <li><Link to="/settings">Settings</Link></li>
                                    <li>
                                        <button
                                            type="button"
                                            className="button button--base button--primary"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li><Link to="/login">Login</Link></li>
                                    <li><Link to="/register">Register</Link></li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
