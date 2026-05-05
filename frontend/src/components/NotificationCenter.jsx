import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, TrendingUp, CheckCircle, X } from 'lucide-react';
import { useData } from '../context/DataContext';

const NotificationCenter = () => {
    const { expenses, budgetLimit } = useData();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
        const percentage = budgetLimit > 0 ? (totalSpent / budgetLimit) * 100 : 0;
        
        const newNotifications = [];

        if (percentage >= 100) {
            newNotifications.push({
                id: 'over-100',
                type: 'danger',
                title: 'Budget Exceeded',
                message: `You have exceeded your monthly budget of ₹${budgetLimit}.`,
                icon: <AlertTriangle className="text-red-500" size={18} />,
                bg: 'bg-red-50',
                time: 'Just now'
            });
        } else if (percentage >= 80) {
            newNotifications.push({
                id: 'over-80',
                type: 'warning',
                title: 'Nearing Budget Limit',
                message: `You have spent ${Math.round(percentage)}% of your budget.`,
                icon: <AlertTriangle className="text-amber-500" size={18} />,
                bg: 'bg-amber-50',
                time: '1 hr ago'
            });
        }

        newNotifications.push({
            id: 'bill-rem',
            type: 'info',
            title: 'Upcoming Bill',
            message: 'Electricity Bill (₹1,250) is estimated to be due soon.',
            icon: <Info className="text-blue-500" size={18} />,
            bg: 'bg-blue-50',
            time: '2 hrs ago'
        });

        newNotifications.push({
            id: 'save-sug',
            type: 'success',
            title: 'Savings Suggestion',
            message: 'Based on your spending, you can save ₹500 this week by cutting dining expenses.',
            icon: <TrendingUp className="text-green-500" size={18} />,
            bg: 'bg-green-50',
            time: '1 day ago'
        });

        setNotifications(newNotifications);
        setUnreadCount(newNotifications.length);
    }, [expenses, budgetLimit]);

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-full hover:bg-slate-100"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-semibold text-slate-800">Notifications</h3>
                        <button 
                            onClick={() => {setUnreadCount(0); setIsOpen(false);}}
                            className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Mark all as read
                        </button>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">
                                <CheckCircle className="mx-auto mb-2 text-slate-300" size={24} />
                                You're all caught up!
                            </div>
                        ) : (
                            notifications.map(notif => (
                                <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
                                    <div className={`w-8 h-8 rounded-full ${notif.bg} flex items-center justify-center shrink-0`}>
                                        {notif.icon}
                                    </div>
                                    <div>
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h4 className="font-medium text-slate-800 text-sm">{notif.title}</h4>
                                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                        <button className="text-xs font-medium text-slate-600 hover:text-slate-800">
                            View all notifications
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
