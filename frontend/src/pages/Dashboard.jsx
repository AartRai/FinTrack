import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Wallet, CreditCard, ArrowUpRight, PiggyBank, Calendar, Lightbulb, TrendingUp, MoreHorizontal } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const COLORS = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#94a3b8'];

const StatCard = ({ title, amount, icon: Icon, trend, colorClass }) => (
    <div className="card group hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${colorClass}`}>
                <Icon size={20} />
            </div>
        </div>
        <div className="flex items-end gap-3 mb-1">
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                ₹ {amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h2>
        </div>
        {trend && (
            <div className="flex items-center gap-1 mt-2">
                <span className={`text-xs font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </span>
                <span className="text-[10px] text-slate-400">from last month</span>
            </div>
        )}
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const { expenses, income, budgetLimit } = useData();

    // Calculate dynamic stats
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalBalance = totalIncome - totalExpenses;
    const savings = totalBalance > 0 ? totalBalance : 0;

    // Calculate category breakdown
    const categoryMap = expenses.reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
    }, {});
    const categoryData = Object.keys(categoryMap).map(key => ({ name: key, value: categoryMap[key] }));

    // Calculate daily expenses for line chart
    const dailyMap = expenses.reduce((acc, curr) => {
        const dateStr = new Date(curr.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
        acc[dateStr] = (acc[dateStr] || 0) + curr.amount;
        return acc;
    }, {});
    const dailyData = Object.keys(dailyMap)
        .reverse() // Basic chronological sort assumption based on input order
        .map(key => ({ date: key, amount: dailyMap[key] }));

    // Combined recent transactions (expenses + income)
    const allTxs = [
        ...expenses.map(e => ({ ...e, type: 'Expense' })),
        ...income.map(i => ({ title: i.source, category: 'Income', amount: i.amount, date: i.date, type: 'Income' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

                        // Only needed once, but replacing this chunk to strip out the fake loading effect entirely


    return (
        <div className="space-y-6 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Welcome back, {user?.name?.split(' ')[0]}! 👋</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm transition-colors">
                        <Calendar size={16} className="text-slate-400" />
                        <span>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Balance" 
                    amount={totalBalance} 
                    icon={Wallet} 
                    colorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                    trend={totalExpenses > 0 || totalIncome > 0 ? 12.5 : null}
                />
                <StatCard 
                    title="Total Expenses" 
                    amount={totalExpenses} 
                    icon={CreditCard} 
                    colorClass="bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400" 
                    trend={totalExpenses > 0 ? -4.2 : null}
                />
                <StatCard 
                    title="Total Income" 
                    amount={totalIncome} 
                    icon={ArrowUpRight} 
                    colorClass="bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400" 
                    trend={totalIncome > 0 ? 8.1 : null}
                />
                <StatCard 
                    title="Savings" 
                    amount={savings} 
                    icon={PiggyBank} 
                    colorClass="bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400" 
                />
            </div>

            {totalExpenses === 0 && totalIncome === 0 && (
                <div className="card py-12 flex flex-col items-center text-center space-y-6 border-dashed border-2">
                    <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 animate-bounce">
                        <TrendingUp size={40} />
                    </div>
                    <div className="max-w-md">
                        <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">Start your journey!</h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Add your first income or expense to see the magic happen on your dashboard.</p>
                    </div>
                    <div className="flex gap-4">
                        <a href="/income" className="btn-primary">Add Income</a>
                        <a href="/expenses" className="btn-primary bg-slate-800 dark:bg-slate-700">Add Expense</a>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart */}
                <div className="card lg:col-span-2 overflow-hidden">
                    <div className="flex justify-between items-center mb-8 px-2">
                        <div>
                            <h3 className="font-bold text-[hsl(var(--foreground))] text-lg">Expenses Overview</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Daily spending tracker</p>
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyData.length > 0 ? dailyData : [{date:'Today', amount:0}]}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                                <XAxis 
                                    dataKey="date" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'currentColor', fontSize: 12}} 
                                    dy={10}
                                    className="text-slate-400 dark:text-slate-500"
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: 'currentColor', fontSize: 12}} 
                                    dx={-10} 
                                    tickFormatter={(v) => v > 1000 ? v/1000+'k' : v}
                                    className="text-slate-400 dark:text-slate-500"
                                />
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--surface))', 
                                        borderRadius: '12px', 
                                        border: '1px solid hsl(var(--border))', 
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                        color: 'hsl(var(--foreground))'
                                    }}
                                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                                    cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#22c55e" 
                                    strokeWidth={4} 
                                    fillOpacity={1} 
                                    fill="url(#colorAmount)"
                                    activeDot={{ r: 6, fill: '#22c55e', stroke: '#fff', strokeWidth: 2 }} 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="card flex flex-col">
                    <h3 className="font-bold text-[hsl(var(--foreground))] text-lg mb-8">Expenses by Category</h3>
                    <div className="h-60 relative flex items-center justify-center flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData.length > 0 ? categoryData : [{name:'None', value: 1}]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {categoryData.length > 0 ? categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    )) : <Cell fill="hsl(var(--border))" />}
                                </Pie>
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'hsl(var(--surface))', 
                                        borderRadius: '12px', 
                                        border: '1px solid hsl(var(--border))' 
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">Total Spent</span>
                            <span className="text-2xl font-black text-[hsl(var(--foreground))]">₹{totalExpenses.toLocaleString()}</span>
                        </div>
                    </div>
                    {/* Custom Legend */}
                    <div className="mt-8 space-y-3 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
                        {categoryData.map((cat, i) => (
                            <div key={i} className="flex justify-between items-center text-sm group cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                    <span className="text-slate-600 dark:text-slate-400 font-medium group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">{cat.name}</span>
                                </div>
                                <span className="font-bold text-[hsl(var(--foreground))]">₹{cat.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Budget Overview */}
                <div className="card col-span-1 border-l-4 border-l-primary-500">
                    <h3 className="font-bold text-[hsl(var(--foreground))] text-lg mb-6">Budget Overview</h3>
                    <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Monthly Target</span>
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Current Spend</span>
                    </div>
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-2xl font-black text-[hsl(var(--foreground))]">₹{budgetLimit.toLocaleString()}</span>
                        <span className="text-primary-600 dark:text-primary-400 font-bold">₹{totalExpenses.toLocaleString()}</span>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3 p-0.5">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${totalExpenses > budgetLimit ? 'bg-red-500' : 'bg-gradient-to-r from-primary-400 to-primary-600'}`} 
                            style={{ width: `${Math.min((totalExpenses / (budgetLimit || 1)) * 100, 100)}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Remaining: <span className="text-[hsl(var(--foreground))] font-bold">₹{Math.max(budgetLimit - totalExpenses, 0).toLocaleString()}</span></span>
                        <span className={`${totalExpenses > budgetLimit ? 'text-red-500' : 'text-primary-500'}`}>{Math.round((totalExpenses / (budgetLimit || 1)) * 100)}%</span>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="card lg:col-span-1">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-[hsl(var(--foreground))] text-lg">Recent Activities</h3>
                        </div>
                        <a href="/transactions" className="text-xs text-primary-500 hover:text-primary-600 font-bold uppercase tracking-wider">View All</a>
                    </div>
                    <div className="space-y-3">
                        {allTxs.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-8">No recent transactions</p>
                        ) : allTxs.map((tx, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100/50 dark:border-slate-800/50 p-3 rounded-2xl hover:border-primary-200 dark:hover:border-primary-900/50 transition-all cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform ${tx.type === 'Income' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600'}`}>
                                        {tx.type === 'Income' ? <ArrowUpRight size={20} /> : <CreditCard size={20} />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[hsl(var(--foreground))]" title={tx.title}>{tx.title.substring(0,18)}{tx.title.length>18?'...':''}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-500 font-bold uppercase tracking-widest">{tx.category} • {new Date(tx.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`font-black text-sm ${tx.type === 'Income' ? 'text-emerald-500' : 'text-red-500'}`}>
                                    {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tip Card */}
                <div className="card lg:col-span-1 border border-primary-100/50 dark:border-primary-900/30 bg-gradient-to-br from-[hsl(var(--surface))] to-primary-50/30 dark:to-primary-950/20 relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary-200/20 dark:bg-primary-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                    <h3 className="font-bold text-[hsl(var(--foreground))] text-lg mb-6 flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                            <Lightbulb size={18} />
                        </div>
                        Financial Insight
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-8 relative z-10 font-medium">
                        "Your spending on <span className="text-primary-600 dark:text-primary-400 font-bold">Entertainment</span> is 20% higher than last week. Consider setting a daily cap to reach your savings goal faster!"
                    </p>
                    <div className="flex justify-center relative">
                        <div className="w-full h-32 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-white/60 dark:border-slate-800/60 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-primary-500/5">
                            <TrendingUp className="text-primary-500 w-16 h-16 opacity-50" />
                            <div className="absolute top-4 right-6 w-12 h-4 bg-emerald-500/20 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-6 left-8 w-20 h-4 bg-primary-500/20 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
