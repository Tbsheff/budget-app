import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Welcome to Budget Planner!</h1>
            <p>Take control of your finances with our easy-to-use budgeting app.</p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/register" style={{ marginRight: '1rem' }}>
                    <button style={styles.button}>Get Started</button>
                </Link>
                <Link to="/login">
                    <button style={styles.button}>Login</button>
                </Link>
            </div>
        </div>
    );
}

const styles = {
    button: {
        padding: '1rem 2rem',
        fontSize: '1rem',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        margin: '0.5rem',
        textDecoration: 'none',
    },
};

export default LandingPage;
