import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PieChart, Wallet, Replace, Target, Activity, Settings, TrendingUp, BookOpen, Bot, X } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Expenses', path: '/expenses', icon: PieChart },
        { name: 'Budgets', path: '/budgets', icon: Wallet },
        { name: 'Income', path: '/income', icon: TrendingUp },
        { name: 'Reports', path: '/reports', icon: Activity },
        { name: 'Education', path: '/education', icon: BookOpen },
        { name: 'Assistant', path: '/assistant', icon: Bot },
        { name: 'Goals', path: '/goals', icon: Target },
        { name: 'Transactions', path: '/transactions', icon: Replace },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-[hsl(var(--surface))] border-r border-[hsl(var(--border))] flex flex-col h-screen select-none transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="h-20 flex items-center justify-between px-8 border-b border-[hsl(var(--border))]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[hsl(var(--primary))] rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <TrendingUp className="text-white" size={20} strokeWidth={3} />
                    </div>
                    <span className="text-xl font-bold text-[hsl(var(--foreground))] tracking-tight">FinTrack</span>
                </div>
                <button onClick={onClose} className="p-2 text-slate-500 lg:hidden">
                    <X size={20} />
                </button>
            </div>
            
            <nav className="flex-1 py-6 px-4 overflow-y-auto">
                <ul className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.name}>
                                <NavLink 
                                    to={item.path}
                                    onClick={() => window.innerWidth < 1024 && onClose()}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                                        ${isActive 
                                            ? 'sidebar-link-active' 
                                            : 'sidebar-link-inactive'}
                                    `}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-6 mt-auto border-t border-[hsl(var(--border))]">
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Target size={20} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-1">Go Premium</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 px-2">Unlock exclusive features and advanced insights.</p>
                    <button className="w-full bg-[hsl(var(--primary))] hover:brightness-110 text-white py-2 rounded-lg text-sm font-medium transition-all shadow-sm">
                        Upgrade Now
                    </button>
                    {/* decorative blur */}
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary-500/10 blur-xl rounded-full group-hover:scale-150 transition-transform"></div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
