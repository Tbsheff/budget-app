import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Budget from './pages/Budget';
import Savings from './pages/Savings';
import Reports from './pages/Reports';
import LandingPage from './pages/LandingPage';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Private routes */}
                <Route path="/" element={<PrivateRoute />}>
                    <Route index element={<Dashboard />} />
                    <Route path="budget" element={<Budget />} />
                    <Route path="savings" element={<Savings />} />
                    <Route path="reports" element={<Reports />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
