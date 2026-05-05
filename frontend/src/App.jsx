import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Income from './pages/Income';
import Reports from './pages/Reports';
import Education from './pages/Education';
import Assistant from './pages/Assistant';
import Goals from './pages/Goals';
import Transactions from './pages/Transactions';
import Settings from './pages/Settings';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Login />} />
                        
                        <Route element={<ProtectedRoute />}>
                            <Route element={<Layout />}>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/expenses" element={<Expenses />} />
                                <Route path="/budgets" element={<Budgets />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/income" element={<Income />} />
                                <Route path="/education" element={<Education />} />
                                <Route path="/assistant" element={<Assistant />} />
                                <Route path="/goals" element={<Goals />} />
                                <Route path="/transactions" element={<Transactions />} />
                                <Route path="/settings" element={<Settings />} />
                            </Route>
                        </Route>
                    </Routes>
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}


export default App;
