import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [goals, setGoals] = useState([]);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const incomeRes = await axios.get('/api/incomes', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setIncomes(incomeRes.data);

                const expenseRes = await axios.get('/api/expenses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setExpenses(expenseRes.data);

                const goalsRes = await axios.get('/api/goals', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGoals(goalsRes.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [token]);

    // Calculate total income, total expenses, etc.
    const totalIncome = incomes.reduce((acc, inc) => acc + inc.amount, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Dashboard</h1>
            <p>Total Income: {totalIncome}</p>
            <p>Total Expenses: {totalExpenses}</p>
            <p>Savings: {totalIncome - totalExpenses}</p>

            {/* Display goals and progress */}
            <h2>Goals</h2>
            <ul>
                {goals.map((goal) => {
                    const progress = ((goal.currentAmount / goal.targetAmount) * 100).toFixed(2);
                    return (
                        <li key={goal._id}>
                            {goal.title} - {progress}% complete
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Dashboard;
