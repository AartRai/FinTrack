import React, { useState } from 'react';
import { Plus, ArrowUpRight, Briefcase, Award, TrendingUp } from 'lucide-react';
import { useData } from '../context/DataContext';

const Income = () => {
    const { income, addIncome } = useData();
    const [showForm, setShowForm] = useState(false);
    const [newInc, setNewInc] = useState({ source: '', type: 'Salary', amount: '', date: '' });

    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);

    const handleAdd = (e) => {
        e.preventDefault();
        if(!newInc.source || !newInc.amount || !newInc.date) return;
        addIncome({ ...newInc, amount: parseFloat(newInc.amount) });
        setNewInc({ source: '', type: 'Salary', amount: '', date: '' });
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Income</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Track your revenue streams and earnings.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`btn-primary flex items-center gap-2 shadow-lg transition-all ${showForm ? 'bg-slate-800 dark:bg-slate-700' : ''}`}
                >
                    <Plus size={18} className={showForm ? 'rotate-45 transition-transform' : 'transition-transform'} />
                    <span>{showForm ? 'Close' : 'Add Income'}</span>
                </button>
            </div>

            {showForm && (
                <div className="card bg-[hsl(var(--surface))] border-blue-500/20 animate-in fade-in zoom-in-95 duration-300">
                    <h3 className="font-bold text-[hsl(var(--foreground))] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
                        Record New Income
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Source</label>
                            <input required type="text" className="input-field" placeholder="e.g. Salary, Client X" value={newInc.source} onChange={e => setNewInc({...newInc, source: e.target.value})} />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type</label>
                            <select className="input-field" value={newInc.type} onChange={e => setNewInc({...newInc, type: e.target.value})}>
                                <option>Salary</option><option>Freelance</option><option>Investment</option><option>Other</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount (₹)</label>
                            <input required type="number" step="0.01" className="input-field" placeholder="0.00" value={newInc.amount} onChange={e => setNewInc({...newInc, amount: e.target.value})} />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date</label>
                            <input required type="date" className="input-field" value={newInc.date} onChange={e => setNewInc({...newInc, date: e.target.value})} />
                        </div>
                        <div className="md:col-span-4 flex justify-end">
                            <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 px-10 shadow-lg shadow-blue-500/20 border-none">Save Income</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="card bg-gradient-to-br from-blue-600 to-blue-700 border-none text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                    <div className="relative z-10">
                        <h3 className="text-blue-100 text-xs font-black uppercase tracking-widest mb-1">Total Earned (This Month)</h3>
                        <h2 className="text-4xl font-black mb-6 tracking-tight">₹{totalIncome.toLocaleString()}</h2>
                        <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-xl backdrop-blur-md border border-white/10">
                            <ArrowUpRight size={16} className="text-emerald-300" />
                            <span className="text-emerald-300 font-black text-xs">+15.7%</span>
                            <span className="text-blue-100 text-[10px] font-bold uppercase tracking-tighter ml-1">Growth</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card p-0 overflow-hidden border-[hsl(var(--border))]">
                <div className="p-6 border-b border-[hsl(var(--border))] flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/20">
                    <h3 className="font-bold text-[hsl(var(--foreground))] text-lg">Income History</h3>
                    <button className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors">Export CSV</button>
                </div>
                <div className="divide-y divide-[hsl(var(--border))]">
                    {income.length === 0 ? (
                        <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">No income records yet. Track your first earnings today!</div>
                    ) : income.map((item) => {
                        const Icon = item.type === 'Salary' ? Briefcase : Award;
                        return (
                            <div key={item._id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all group cursor-default">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                        <Icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[hsl(var(--foreground))] text-xl mb-0.5 tracking-tight">{item.source}</h4>
                                        <p className="text-slate-500 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{item.type} • {new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-black text-emerald-500 flex items-center gap-1">
                                        <span className="text-sm">+</span>
                                        ₹{item.amount.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Income;
