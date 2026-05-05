import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { CreditCard, Search, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

const Transactions = () => {
    const { expenses, income } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All'); // All, Income, Expense

    // Combine and sort
    const allTxs = [
        ...expenses.map(e => ({ ...e, type: 'Expense' })),
        ...income.map(i => ({ title: i.source || 'Unknown Income', category: i.type || 'Income', amount: i.amount || 0, date: i.date || new Date().toISOString(), type: 'Income' }))
    ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

    // Filter
    const filteredTxs = allTxs.filter(tx => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = (tx.title || '').toLowerCase().includes(searchLower) || (tx.category || '').toLowerCase().includes(searchLower);
        const matchesType = filterType === 'All' || tx.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Transactions</h1>
                    <p className="text-slate-500 mt-1">View and search your complete financial history.</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <select 
                            className="appearance-none pl-10 pr-8 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm font-medium text-slate-700 bg-white"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Income">Income Only</option>
                            <option value="Expense">Expenses Only</option>
                        </select>
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    </div>
                </div>
            </div>

            <div className="card overflow-hidden p-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredTxs.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-slate-500">
                                        No transactions found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredTxs.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tx.type === 'Income' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                                    {tx.type === 'Income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-800">{tx.title || 'Unknown'}</div>
                                                    <div className="text-xs text-slate-500 md:hidden mt-0.5">{tx.category || 'Uncategorized'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 hidden md:table-cell">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {tx.category || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-600">
                                            {(() => {
                                                try {
                                                    const d = new Date(tx.date);
                                                    if (isNaN(d.getTime())) return 'Unknown Date';
                                                    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'medium', day: 'numeric' });
                                                } catch(e) {
                                                    return 'Unknown Date';
                                                }
                                            })()}
                                        </td>
                                        <td className={`py-4 px-6 text-right font-semibold ${tx.type === 'Income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {tx.type === 'Income' ? '+' : '-'} ₹{Number(tx.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
