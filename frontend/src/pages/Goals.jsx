import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Target, Plus, TrendingUp, Award, CheckCircle2, X } from 'lucide-react';

const COLORS = [
    { name: 'Emerald', value: 'emerald' },
    { name: 'Blue', value: 'blue' },
    { name: 'Amber', value: 'amber' },
    { name: 'Purple', value: 'purple' },
    { name: 'Rose', value: 'rose' }
];

const Goals = () => {
    const { goals, addGoal, updateGoalProgress, deleteGoal } = useData();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGoal, setNewGoal] = useState({ title: '', target: '', current: '', color: 'blue' });

    const handleAddGoal = (e) => {
        e.preventDefault();
        addGoal({
            title: newGoal.title,
            target: parseFloat(newGoal.target),
            current: parseFloat(newGoal.current) || 0,
            color: newGoal.color
        });
        setNewGoal({ title: '', target: '', current: '', color: 'blue' });
        setShowAddModal(false);
    };

    return (
        <div className="space-y-6 relative h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[hsl(var(--foreground))] tracking-tight">Financial Goals</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Set and track your milestones for financial freedom.</p>
                </div>
                <button 
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/20 px-6 py-3"
                >
                    <Plus size={18} />
                    <span>Create New Goal</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {goals.map((goal) => {
                    const percent = Math.min((goal.current / goal.target) * 100, 100);
                    const isCompleted = percent >= 100;
                    
                    // Dynamic color classes based on the selected color
                    const textClass = `text-${goal.color}-500 dark:text-${goal.color}-400`;
                    const bgClass = `bg-${goal.color}-500`;
                    const lightBgClass = `bg-${goal.color}-50 dark:bg-${goal.color}-900/20`;
                    const borderClass = `border-${goal.color}-100 dark:border-${goal.color}-900/30`;

                    return (
                        <div key={goal._id} className={`card group border-2 transition-all hover:shadow-xl duration-500 ${isCompleted ? 'border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-800'}`}>
                            <div className="flex justify-between items-start mb-8">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500 ${isCompleted ? 'bg-emerald-500 text-white' : `${lightBgClass} ${textClass} border ${borderClass}`}`}>
                                    {isCompleted ? <CheckCircle2 size={28} /> : <Target size={28} />}
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-[hsl(var(--foreground))] tracking-tighter">{percent.toFixed(0)}%</div>
                                    <div className="text-[10px] text-slate-500 dark:text-slate-500 font-black uppercase tracking-[0.1em]">Target Progress</div>
                                </div>
                            </div>
                            
                            <h3 className="text-xl font-black text-[hsl(var(--foreground))] mb-1 tracking-tight">{goal.title}</h3>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8">Goal: <span className="text-[hsl(var(--foreground))]">₹{goal.target.toLocaleString('en-IN')}</span></p>

                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                                    <span className="text-slate-600 dark:text-slate-300">Saved: ₹{goal.current.toLocaleString('en-IN')}</span>
                                    <span className="text-slate-400">₹{(goal.target - goal.current > 0 ? goal.target - goal.current : 0).toLocaleString('en-IN')} left</span>
                                </div>
                                <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : bgClass}`}
                                        style={{ width: `${percent}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-[hsl(var(--border))] flex justify-between items-center">
                                <button 
                                    onClick={() => updateGoalProgress(goal._id, goal.current + 1000)}
                                    className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 transition-colors ${isCompleted ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'text-primary-500 hover:text-primary-600'}`}
                                    disabled={isCompleted}
                                >
                                    <TrendingUp size={16} /> Add ₹1k
                                </button>
                                <button 
                                    onClick={() => deleteGoal(goal._id)}
                                    className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}

                {/* Empty State / Add CTA */}
                {goals.length === 0 && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center border-4 border-dashed border-slate-100 dark:border-slate-800/50 rounded-[32px] bg-slate-50/30 dark:bg-slate-900/10 text-center animate-in fade-in duration-700">
                        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[32px] flex items-center justify-center shadow-xl shadow-blue-500/10 mb-8 text-blue-500 group">
                            <Award size={48} className="group-hover:scale-125 transition-transform duration-500" />
                        </div>
                        <h3 className="text-2xl font-black text-[hsl(var(--foreground))] mb-3 tracking-tight">Financial freedom starts with a goal.</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-10 font-medium">Setting targets turns your dreams into actionable steps. Let's create your first milestone together.</p>
                        <button 
                            onClick={() => setShowAddModal(true)}
                            className="btn-primary flex items-center gap-3 px-10 py-4 shadow-2xl shadow-primary-500/30"
                        >
                            <Plus size={20} />
                            <span className="font-black uppercase tracking-widest text-sm">Start Saving Now</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Add Goal Modal Overlay */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-[hsl(var(--surface))] rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-[hsl(var(--border))]">
                        <div className="px-8 py-6 border-b border-[hsl(var(--border))] flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
                            <h2 className="text-xl font-black text-[hsl(var(--foreground))] tracking-tight">Create New Milestone</h2>
                            <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all">
                                <X size={18} />
                            </button>
                        </div>
                        <form onSubmit={handleAddGoal} className="p-8 space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Goal Title</label>
                                <input 
                                    type="text" 
                                    required
                                    className="input-field" 
                                    placeholder="e.g. Dream House, New Car..."
                                    value={newGoal.title}
                                    onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Target (₹)</label>
                                    <input 
                                        type="number" 
                                        required
                                        min="1"
                                        className="input-field" 
                                        placeholder="500,000"
                                        value={newGoal.target}
                                        onChange={e => setNewGoal({...newGoal, target: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Initial (₹)</label>
                                    <input 
                                        type="number" 
                                        min="0"
                                        className="input-field" 
                                        placeholder="10,000"
                                        value={newGoal.current}
                                        onChange={e => setNewGoal({...newGoal, current: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Milestone Theme</label>
                                <div className="flex justify-between bg-slate-50 dark:bg-slate-900/50 p-3 rounded-2xl border border-[hsl(var(--border))]">
                                    {COLORS.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            onClick={() => setNewGoal({...newGoal, color: c.value})}
                                            className={`w-10 h-10 rounded-full bg-${c.value}-500 flex items-center justify-center transition-all duration-300 relative group`}
                                            title={c.name}
                                        >
                                            {newGoal.color === c.value && (
                                                <div className="absolute -inset-1.5 border-2 border-primary-500 rounded-full animate-pulse"></div>
                                            )}
                                            {newGoal.color === c.value && <CheckCircle2 size={18} className="text-white relative z-10" />}
                                            <div className="absolute -bottom-1 w-0 h-1 bg-white/50 rounded-full group-hover:w-4 transition-all duration-300"></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="pt-4 flex gap-4">
                                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-4 rounded-2xl border border-[hsl(var(--border))] text-slate-500 font-black uppercase tracking-widest text-xs hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">Cancel</button>
                                <button type="submit" className="flex-[2] btn-primary shadow-xl shadow-primary-500/20 font-black uppercase tracking-widest text-sm">Activate Goal</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Goals;
