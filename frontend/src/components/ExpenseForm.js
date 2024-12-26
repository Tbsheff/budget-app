import React, { useState } from 'react';
import axios from 'axios';

function ExpenseForm({ onExpenseAdded }) {
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        amount: '',
        date: '',
        frequency: 'once',
        isRecurring: false
    });
    const token = localStorage.getItem('token');

    const onChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onCheckboxChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.checked }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/expenses', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({
                category: '',
                description: '',
                amount: '',
                date: '',
                frequency: 'once',
                isRecurring: false
            });
            onExpenseAdded();
        } catch (err) {
            console.error(err);
            alert('Error adding expense');
        }
    };

    return (
        <div>
            <h3>Add Expense</h3>
            <form onSubmit={onSubmit}>
                <div>
                    <label>Category: </label>
                    <input name="category" value={formData.category} onChange={onChange} />
                </div>
                <div>
                    <label>Description: </label>
                    <input
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                    />
                </div>
                <div>
                    <label>Amount: </label>
                    <input name="amount" type="number" value={formData.amount} onChange={onChange} />
                </div>
                <div>
                    <label>Date: </label>
                    <input name="date" type="date" value={formData.date} onChange={onChange} />
                </div>
                <div>
                    <label>Frequency: </label>
                    <select name="frequency" value={formData.frequency} onChange={onChange}>
                        <option value="once">Once</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>
                        <option value="weekly">Weekly</option>
                        <option value="biweekly">Biweekly</option>
                        <option value="quarterly">Quarterly</option>
                    </select>
                </div>
                <div>
                    <label>Recurring: </label>
                    <input
                        name="isRecurring"
                        type="checkbox"
                        checked={formData.isRecurring}
                        onChange={onCheckboxChange}
                    />
                </div>
                <button type="submit">Add Expense</button>
            </form>
        </div>
    );
}

export default ExpenseForm;
