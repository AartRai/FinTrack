import React, { useState } from 'react';
import { Plus, Search, Filter, MoreHorizontal, ArrowDownRight, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';

const Expenses = () => {
    const { expenses, addExpense, deleteExpense } = useData();
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState({ title: '', category: 'Food & Dining', amount: '', date: '' });

    const [searchTerm, setSearchTerm] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if(!newExpense.title || !newExpense.amount || !newExpense.date) return;
        addExpense({ ...newExpense, amount: parseFloat(newExpense.amount) });
        setNewExpense({ title: '', category: 'Food & Dining', amount: '', date: '' });
        setShowForm(false);
    };

    const filteredExpenses = expenses.filter(e => 
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Expenses</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and track your outgoing payments.</p>
                </div>
                <button 
                    onClick={() => setShowForm(!showForm)} 
                    className={`btn-primary flex items-center gap-2 pr-6 shadow-lg transition-all ${showForm ? 'bg-slate-800 dark:bg-slate-700' : ''}`}
                >
                    <Plus size={18} className={showForm ? 'rotate-45 transition-transform' : 'transition-transform'} />
                    <span>{showForm ? 'Close' : 'Add Expense'}</span>
                </button>
            </div>

            {showForm && (
                <div className="card bg-[hsl(var(--surface))] border-primary-500/20 animate-in fade-in zoom-in-95 duration-300">
                    <h3 className="font-bold text-[hsl(var(--foreground))] mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-primary-500 rounded-full"></div>
                        Add New Expense
                    </h3>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="col-span-1 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Title</label>
                            <input autoFocus required type="text" className="input-field" placeholder="What did you buy?" value={newExpense.title} onChange={e => setNewExpense({...newExpense, title: e.target.value})} />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Category</label>
                            <select className="input-field" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                                <option>Food & Dining</option><option>Transport</option><option>Shopping</option>
                                <option>Bills & Utilities</option><option>Entertainment</option><option>Others</option>
                            </select>
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount (₹)</label>
                            <input required type="number" step="0.01" className="input-field" placeholder="0.00" value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} />
                        </div>
                        <div className="col-span-1 md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date</label>
                            <input required type="date" className="input-field" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
                        </div>
                        <div className="md:col-span-4 flex justify-end">
                            <button type="submit" className="btn-primary px-10 shadow-lg shadow-primary-500/20">Save Transaction</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="card p-0 overflow-hidden border-[hsl(var(--border))]">
                <div className="p-4 border-b border-[hsl(var(--border))] flex flex-col sm:flex-row justify-between items-center bg-slate-50/30 dark:bg-slate-900/20 gap-4">
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all text-[hsl(var(--foreground))]"
                        />
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] px-4 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                </div>
                
                <div className="overflow-x-auto scrollbar-thin">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black border-b border-[hsl(var(--border))]">
                                <th className="px-6 py-5 font-black">Transaction</th>
                                <th className="px-6 py-5 font-black text-center">Category</th>
                                <th className="px-6 py-5 font-black">Date</th>
                                <th className="px-6 py-5 font-black text-right">Amount</th>
                                <th className="px-6 py-5 font-black text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[hsl(var(--border))]">
                            {filteredExpenses.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">No transactions found.</td></tr>
                            ) : filteredExpenses.map((expense) => (
                                <tr key={expense._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 transition-all group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-[hsl(var(--foreground))]" title={expense.title}>{expense.title.substring(0,30)}{expense.title.length>30?'...':''}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                                        {new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="font-black text-[hsl(var(--foreground))] flex items-center justify-end gap-1">
                                            <ArrowDownRight size={14} className="text-red-500" />
                                            ₹{expense.amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => deleteExpense(expense._id)} 
                                            className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100" 
                                            title="Delete Expense"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expenses;
