import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Reports() {
    const token = localStorage.getItem('token');
    const [monthlyReport, setMonthlyReport] = useState(null);
    const [yearlyReport, setYearlyReport] = useState(null);

    useEffect(() => {
        // Example of how you might do some basic reporting
        const fetchReports = async () => {
            try {
                const expensesRes = await axios.get('/api/expenses', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const incomesRes = await axios.get('/api/incomes', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Basic grouping or calculations can be done here
                const currentMonth = new Date().getMonth();
                const monthlyExpenses = expensesRes.data.filter(
                    (exp) => new Date(exp.date).getMonth() === currentMonth
                );
                const monthlyIncomes = incomesRes.data; // Could filter as well
                const totalMonthlyExpenses = monthlyExpenses.reduce((acc, exp) => acc + exp.amount, 0);
                const totalMonthlyIncome = monthlyIncomes.reduce((acc, inc) => acc + inc.amount, 0);

                setMonthlyReport({
                    totalIncome: totalMonthlyIncome,
                    totalExpenses: totalMonthlyExpenses,
                    net: totalMonthlyIncome - totalMonthlyExpenses
                });

                // Similarly for yearly
                const currentYear = new Date().getFullYear();
                const yearlyExpenses = expensesRes.data.filter(
                    (exp) => new Date(exp.date).getFullYear() === currentYear
                );
                const yearlyIncomes = incomesRes.data.filter(
                    (inc) => new Date(inc.createdAt).getFullYear() === currentYear
                );
                const totalYearlyExpenses = yearlyExpenses.reduce((acc, exp) => acc + exp.amount, 0);
                const totalYearlyIncome = yearlyIncomes.reduce((acc, inc) => acc + inc.amount, 0);

                setYearlyReport({
                    totalIncome: totalYearlyIncome,
                    totalExpenses: totalYearlyExpenses,
                    net: totalYearlyIncome - totalYearlyExpenses
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchReports();
    }, [token]);

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Reports</h1>
            {monthlyReport && (
                <div>
                    <h2>Monthly Report</h2>
                    <p>Total Income: {monthlyReport.totalIncome}</p>
                    <p>Total Expenses: {monthlyReport.totalExpenses}</p>
                    <p>Net: {monthlyReport.net}</p>
                </div>
            )}
            {yearlyReport && (
                <div>
                    <h2>Yearly Report</h2>
                    <p>Total Income: {yearlyReport.totalIncome}</p>
                    <p>Total Expenses: {yearlyReport.totalExpenses}</p>
                    <p>Net: {yearlyReport.net}</p>
                </div>
            )}
        </div>
    );
}

export default Reports;
