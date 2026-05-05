import React from 'react';
import { Search, ChevronDown, Sun, Moon, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import NotificationCenter from './NotificationCenter';

const Navbar = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const getAvatarUrl = () => {
        if (!user?.avatar) return null;
        if (user.avatar.startsWith('http')) return user.avatar;
        return `http://localhost:8000/storage/${user.avatar}`;
    };

    return (
        <nav className="flex justify-between items-center bg-[hsl(var(--surface))] border-b border-[hsl(var(--border))] px-4 md:px-8 py-4 h-20 transition-colors duration-300">
            <div className="flex items-center gap-4 lg:hidden mr-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            <div className="flex-1 flex max-w-xl hidden md:flex">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search anything..." 
                        className="w-full bg-slate-50 dark:bg-slate-900/50 border-none rounded-full py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-600 dark:text-slate-300 transition-all font-medium"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-6 ml-auto">
                <button 
                    onClick={toggleTheme}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-primary-500 transition-all border border-slate-100 dark:border-slate-800"
                    title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <NotificationCenter />
                
                <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-slate-200 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                        {getAvatarUrl() ? (
                            <img src={getAvatarUrl()} alt={user?.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-primary-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || 'User'}</span>
                        <button onClick={logout} className="text-xs text-slate-500 hover:text-red-500 text-left flex items-center gap-1">
                            <LogOut size={12} /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
