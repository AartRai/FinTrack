import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { User, Bell, Shield, Globe, Monitor, LogOut, Camera, Loader2, CheckCircle2, AlertCircle, Moon, Sun } from 'lucide-react';

const Settings = () => {
    const { user, setUser, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });
    
    // Form state
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const fileInputRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await api.put('/user/profile', formData);
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error) {
            console.error('Update failed', error);
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || 'Failed to update profile. Please try again.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setIsLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await api.post('/user/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setStatus({ type: 'success', message: 'Avatar uploaded successfully!' });
        } catch (error) {
            console.error('Avatar upload failed', error);
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || 'Failed to upload avatar. Max size 2MB.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getAvatarUrl = () => {
        if (!user?.avatar) return null;
        if (user.avatar.startsWith('http')) return user.avatar;
        return `http://localhost:8000/storage/${user.avatar}`;
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20 px-4 md:px-0">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Settings</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account preferences and settings.</p>
            </div>

            {status.message && (
                <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                    status.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-sm font-medium">{status.message}</p>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 space-y-1">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'profile' ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                    >
                        <User size={18} /> Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('preferences')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'preferences' ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                    >
                        <Globe size={18} /> Preferences
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'security' ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                    >
                        <Shield size={18} /> Security
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
                    >
                        <Bell size={18} /> Notifications
                    </button>
                    
                    <div className="pt-4 mt-4 border-t border-[hsl(var(--border))]">
                        <button 
                            onClick={logout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                        >
                            <LogOut size={18} /> Log Out
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
                    <div className="card">
                        
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6">Profile Information</h2>
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="relative group">
                                        <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold shadow-sm overflow-hidden border-2 border-white dark:border-slate-800 ring-1 ring-slate-200 dark:ring-slate-700">
                                            {getAvatarUrl() ? (
                                                <img src={getAvatarUrl()} alt={user?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                user?.name?.charAt(0) || 'U'
                                            )}
                                        </div>
                                        <button 
                                            onClick={handleAvatarClick}
                                            className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-110"
                                            title="Upload Avatar"
                                        >
                                            <Camera size={14} />
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            accept="image/*" 
                                            onChange={handleAvatarUpload}
                                        />
                                    </div>
                                    <div>
                                        <button 
                                            onClick={handleAvatarClick}
                                            className="btn-primary text-sm shadow-sm"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Upload Avatar'}
                                        </button>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">JPG, GIF or PNG. Max size of 2MB.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveChanges} className="space-y-5 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            className="input-field" 
                                            value={formData.name} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            className="input-field" 
                                            value={formData.email} 
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button 
                                            type="submit" 
                                            className="btn-primary shadow-sm flex items-center gap-2"
                                            disabled={isLoading}
                                        >
                                            {isLoading && <Loader2 size={18} className="animate-spin" />}
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6">App Preferences</h2>
                                
                                <div className="space-y-6 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Currency</label>
                                        <select className="input-field cursor-pointer appearance-none">
                                            <option value="INR">Indian Rupee (₹)</option>
                                            <option value="USD">US Dollar ($)</option>
                                            <option value="EUR">Euro (€)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Language</label>
                                        <select className="input-field cursor-pointer appearance-none">
                                            <option value="en">English</option>
                                            <option value="hi">Hindi</option>
                                        </select>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-[hsl(var(--border))]">
                                        <h3 className="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Appearance</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button 
                                                onClick={() => setTheme('light')}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${theme === 'light' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-600' : 'border-[hsl(var(--border))] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
                                            >
                                                <Sun size={24} />
                                                <span className="text-sm font-medium">Light Mode</span>
                                            </button>
                                            <button 
                                                onClick={() => setTheme('dark')}
                                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${theme === 'dark' ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-600' : 'border-[hsl(var(--border))] text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50'}`}
                                            >
                                                <Moon size={24} />
                                                <span className="text-sm font-medium">Dark Mode</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6">Security Settings</h2>
                                
                                <form className="space-y-5 max-w-md">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                                        <input type="password" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                                        <input type="password" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                                        <input type="password" className="input-field" />
                                    </div>
                                    <div className="pt-4">
                                        <button type="button" className="btn-primary shadow-sm">Update Password</button>
                                    </div>
                                </form>

                                <div className="mt-12 pt-6 border-t border-red-100 dark:border-red-900/30">
                                    <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                                    <button className="px-4 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 font-medium rounded-lg text-sm hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors">Delete Account</button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="animate-in fade-in duration-300">
                                <h2 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6">Notification Preferences</h2>
                                
                                <div className="space-y-6 max-w-md">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">Email Notifications</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive weekly summaries and alerts.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">Budget Alerts</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Get notified when you exceed 80% of your budget.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-[hsl(var(--foreground))]">Goal Reminders</h3>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly check-ins on your savings goals.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
