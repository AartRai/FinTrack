import React, { useState } from 'react';
import { Target, AlertCircle, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';

const Budgets = () => {
    const { expenses, budgetLimit, weeklyBudgetLimit, updateBudgetLimit, updateWeeklyBudgetLimit } = useData();
    const [amt, setAmt] = useState('');
    const [weeklyAmt, setWeeklyAmt] = useState('');

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // For weekly demo, assume last 7 days spending
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklySpent = expenses
        .filter(e => new Date(e.date) >= sevenDaysAgo)
        .reduce((sum, e) => sum + e.amount, 0);

    const percentage = Math.min((totalSpent / (budgetLimit || 1)) * 100, 100);
    const left = Math.max(budgetLimit - totalSpent, 0);

    const weeklyPercentage = Math.min((weeklySpent / (weeklyBudgetLimit || 1)) * 100, 100);
    const weeklyLeft = Math.max(weeklyBudgetLimit - weeklySpent, 0);

    const handleSaveMonthly = (e) => {
        e.preventDefault();
        if(!amt) return;
        updateBudgetLimit(amt);
        setAmt('');
    };

    const handleSaveWeekly = (e) => {
        e.preventDefault();
        if(!weeklyAmt) return;
        updateWeeklyBudgetLimit(weeklyAmt);
        setWeeklyAmt('');
    };

    return (
        <div className="space-y-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Budgets</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Set limits and stick to your financial goals.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Budget Card */}
                <div className="card border-t-4 border-t-primary-500 shadow-lg shadow-primary-500/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-950/30 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400">
                                <Target size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[hsl(var(--foreground))]">Monthly Overall Budget</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">This Month</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-end">
                            <span className="text-3xl font-bold text-[hsl(var(--foreground))]">₹ {totalSpent.toLocaleString()}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">of ₹ {budgetLimit.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${percentage >= 100 ? 'bg-red-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-primary-500'}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm pt-1">
                            <span className="text-slate-500 dark:text-slate-400">{Math.round(percentage)}% Used</span>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">₹ {left.toLocaleString()} Left</span>
                        </div>
                    </div>

                    {percentage >= 80 && (
                        <div className={`flex items-start gap-3 p-4 rounded-xl border mt-6 animate-in fade-in slide-in-from-top-2 duration-300 ${percentage >= 100 ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'}`}>
                            <AlertCircle className={`shrink-0 mt-0.5 ${percentage >= 100 ? 'text-red-500' : 'text-amber-500'}`} size={18} />
                            <p className={`text-sm leading-relaxed ${percentage >= 100 ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                {percentage >= 100 
                                    ? "You have exceeded your monthly budget! Review your expenses immediately to stay on track."
                                    : `Warning: You've used ${Math.round(percentage)}% of your monthly budget. Consider reducing non-essential spending.`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Weekly Budget Card */}
                <div className="card border-t-4 border-t-blue-500 shadow-lg shadow-blue-500/5">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-[hsl(var(--foreground))]">Weekly Budget Limit</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Last 7 Days</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between items-end">
                            <span className="text-3xl font-bold text-[hsl(var(--foreground))]">₹ {weeklySpent.toLocaleString()}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">of ₹ {weeklyBudgetLimit.toLocaleString()}</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${weeklyPercentage >= 100 ? 'bg-red-500' : weeklyPercentage >= 80 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${weeklyPercentage}%` }}></div>
                        </div>
                        <div className="flex justify-between text-sm pt-1">
                            <span className="text-slate-500 dark:text-slate-400">{Math.round(weeklyPercentage)}% Used</span>
                            <span className="text-slate-500 dark:text-slate-400 font-medium">₹ {weeklyLeft.toLocaleString()} Left</span>
                        </div>
                    </div>

                    {weeklyPercentage >= 80 && (
                        <div className={`flex items-start gap-3 p-4 rounded-xl border mt-6 animate-in fade-in slide-in-from-top-2 duration-300 ${weeklyPercentage >= 100 ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30'}`}>
                            <AlertCircle className={`shrink-0 mt-0.5 ${weeklyPercentage >= 100 ? 'text-red-500' : 'text-amber-500'}`} size={18} />
                            <p className={`text-sm leading-relaxed ${weeklyPercentage >= 100 ? 'text-red-700 dark:text-red-400' : 'text-amber-700 dark:text-amber-400'}`}>
                                {weeklyPercentage >= 100 
                                    ? "Alert: You have exceeded your weekly budget limit! Tighten your belt for the rest of the week."
                                    : `You are nearing your weekly budget limit (${Math.round(weeklyPercentage)}% used).`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Update Forms */}
                <div className="card">
                    <h3 className="font-semibold text-[hsl(var(--foreground))] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                        Update Monthly Budget
                    </h3>
                    <form onSubmit={handleSaveMonthly} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Monthly Target Limit (₹)</label>
                            <input required type="number" step="0.01" className="input-field" placeholder="e.g. 50000" value={amt} onChange={e => setAmt(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary w-full mt-2 shadow-lg shadow-primary-500/20">Save Monthly Limit</button>
                    </form>
                </div>

                <div className="card">
                    <h3 className="font-semibold text-[hsl(var(--foreground))] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                        Update Weekly Budget
                    </h3>
                    <form onSubmit={handleSaveWeekly} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">New Weekly Target Limit (₹)</label>
                            <input required type="number" step="0.01" className="input-field" placeholder="e.g. 10000" value={weeklyAmt} onChange={e => setWeeklyAmt(e.target.value)} />
                        </div>
                        <button type="submit" className="w-full mt-2 bg-slate-800 dark:bg-slate-700 text-white py-2.5 rounded-xl font-medium hover:brightness-110 transition-all shadow-lg shadow-slate-500/10 dark:shadow-none">Save Weekly Limit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Budgets;
