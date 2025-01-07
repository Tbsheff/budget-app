import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div class="hero">
            <div class="hero_content">
                <div class="row">
                    <div class="col-1-of-2">
                        <h1 class="hero_title">A better way to manage your money</h1>
                    </div>
                    <div class="col-1-of-2">
                        <img src="/images/coin.svg" alt="Budget App" class="hero_img" />
                    </div>
                </div>
                <div>
                    <button>
                        <a href="/login">Get Started</a>
                    </button>
                </div>
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
