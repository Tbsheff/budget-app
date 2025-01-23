import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Settings() {
    const token = localStorage.getItem('token');
    const [settings, setSettings] = useState({ theme: 'light', currency: 'USD' });

    const fetchUserSettings = async () => {
        try {
            const userRes = await axios.get('/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSettings(userRes.data.settings);
            document.body.className = userRes.data.settings.theme;
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchUserSettings();
    }, []);

    const onChange = (e) => {
        setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        if (e.target.name === 'theme') {
            document.body.className = e.target.value;
        }
    };

    const saveSettings = async () => {
        try {
            await axios.put(
                '/api/users/settings',
                { ...settings },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Settings updated!');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Settings</h1>
            <div>
                <label>Theme: </label>
                <select name="theme" value={settings.theme} onChange={onChange}>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
            </div>
            <div>
                <label>Currency: </label>
                <input name="currency" value={settings.currency} onChange={onChange} />
            </div>
            <button onClick={saveSettings}>Save</button>
        </div>
    );
}

export default Settings;
