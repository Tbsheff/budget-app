import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Savings() {
    const [goals, setGoals] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        targetAmount: '',
        deadline: ''
    });
    const token = localStorage.getItem('token');

    const fetchGoals = async () => {
        try {
            const res = await axios.get('/api/goals', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGoals(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const onChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/goals', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({ title: '', targetAmount: '', deadline: '' });
            fetchGoals();
        } catch (err) {
            console.error(err);
        }
    };

    const handleGoalUpdate = async (id, currentAmount) => {
        try {
            await axios.put(
                `/api/goals/${id}`,
                { currentAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchGoals();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Savings Goals</h1>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Goal Title: </label>
                    <input name="title" value={formData.title} onChange={onChange} />
                </div>
                <div>
                    <label>Target Amount: </label>
                    <input
                        name="targetAmount"
                        type="number"
                        value={formData.targetAmount}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label>Deadline: </label>
                    <input name="deadline" type="date" value={formData.deadline} onChange={onChange} />
                </div>
                <button type="submit">Add Goal</button>
            </form>

            <h2>My Goals</h2>
            <ul>
                {goals.map((goal) => {
                    const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
                    return (
                        <li key={goal._id}>
                            {goal.title} - {progress}% complete
                            <div>
                                Current Amount: {goal.currentAmount} / {goal.targetAmount}
                                <button
                                    onClick={() => {
                                        const newAmount = parseFloat(prompt('Enter new current amount:'));
                                        if (!isNaN(newAmount)) {
                                            handleGoalUpdate(goal._id, newAmount);
                                        }
                                    }}
                                >
                                    Update Amount
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Savings;
