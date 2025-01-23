import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';

function Budget() {
    const [expenses, setExpenses] = useState([]);
    const token = localStorage.getItem('token');

    const fetchExpenses = async () => {
        try {
            const res = await axios.get('/api/expenses', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExpenses(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/expenses/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchExpenses();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Budget</h1>
            <ExpenseForm onExpenseAdded={fetchExpenses} />
            <h2>All Expenses</h2>
            <ul>
                {expenses.map((expense) => (
                    <li key={expense._id}>
                        {expense.description} - {expense.category} - {expense.amount}
                        <button onClick={() => handleDelete(expense._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Budget;
