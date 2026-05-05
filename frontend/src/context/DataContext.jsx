import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    
    const [expenses, setExpenses] = useState([]);
    const [income, setIncome] = useState([]);
    const [goals, setGoals] = useState([]);
    const [budgetLimit, setBudgetLimit] = useState(0);
    const [weeklyBudgetLimit, setWeeklyBudgetLimit] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [expRes, incRes, goalRes, budRes] = await Promise.all([
                api.get('/expenses'),
                api.get('/incomes'),
                api.get('/goals'),
                api.get('/budget')
            ]);
            
            setExpenses(expRes.data);
            setIncome(incRes.data);
            setGoals(goalRes.data);
            setBudgetLimit(budRes.data.amount || 0);
            setWeeklyBudgetLimit(budRes.data.weekly_amount || 0);
        } catch (error) {
            console.error('Failed to fetch data', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const addExpense = async (expense) => {
        try {
            const response = await api.post('/expenses', expense);
            setExpenses(prev => [response.data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            console.error('Failed to add expense', error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await api.delete(`/expenses/${id}`);
            setExpenses(prev => prev.filter(e => e._id !== id));
        } catch (error) {
            console.error('Failed to delete expense', error);
        }
    };

    const addIncome = async (inc) => {
        try {
            const response = await api.post('/incomes', inc);
            setIncome(prev => [response.data, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            console.error('Failed to add income', error);
        }
    };

    const updateBudgetLimit = async (amount) => {
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const response = await api.post('/budget', { amount: parseFloat(amount), month: currentMonth });
            setBudgetLimit(response.data.amount);
        } catch (error) {
            console.error('Failed to update budget', error);
        }
    };

    const updateWeeklyBudgetLimit = async (amount) => {
        try {
            const currentMonth = new Date().toISOString().slice(0, 7);
            const response = await api.post('/budget', { weekly_amount: parseFloat(amount), month: currentMonth });
            setWeeklyBudgetLimit(response.data.weekly_amount);
        } catch (error) {
            console.error('Failed to update weekly budget', error);
        }
    };

    const addGoal = async (goal) => {
        try {
            const response = await api.post('/goals', goal);
            setGoals(prev => [...prev, response.data]);
        } catch (error) {
            console.error('Failed to add goal', error);
        }
    };

    const deleteGoal = async (id) => {
        try {
            await api.delete(`/goals/${id}`);
            setGoals(prev => prev.filter(g => g._id !== id));
        } catch (error) {
            console.error('Failed to delete goal', error);
        }
    };

    const updateGoalProgress = async (id, amount) => {
        try {
            const response = await api.put(`/goals/${id}/progress`, { current: parseFloat(amount) });
            setGoals(prev => prev.map(g => g._id === id ? { ...g, current: response.data.current } : g));
        } catch (error) {
            console.error('Failed to update goal progress', error);
        }
    };

    return (
        <DataContext.Provider value={{ 
            expenses, income, goals, budgetLimit, weeklyBudgetLimit, 
            addExpense, deleteExpense, addIncome, 
            updateBudgetLimit, updateWeeklyBudgetLimit,
            addGoal, deleteGoal, updateGoalProgress,
            loading, refreshData: fetchData
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);
