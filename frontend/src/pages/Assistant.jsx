import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, TrendingUp, ShieldCheck, Target, Zap } from 'lucide-react';
import { useData } from '../context/DataContext';
import api from '../services/api';

const Assistant = () => {
    const { expenses, income, budgetLimit } = useData();
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            text: "Welcome back! I've analyzed your recent activity. I can help you with spending analysis, budget planning, or investment advice. What's on your mind today?", 
            isBot: true 
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const suggestions = [
        { label: "Analyze my spending", icon: <TrendingUp size={14} /> },
        { label: "How is my budget?", icon: <Zap size={14} /> },
        { label: "Saving tips", icon: <ShieldCheck size={14} /> },
        { label: "Investment advice", icon: <Target size={14} /> }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e, customInput = null) => {
        if (e) e.preventDefault();
        const textToSend = customInput || input;
        if (!textToSend.trim()) return;

        const userMsg = { id: Date.now(), text: textToSend, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await api.post('/insights/chat', { message: textToSend });
            setMessages(prev => [...prev, { id: Date.now() + 1, text: response.data.reply, isBot: true }]);
        } catch (error) {
            console.error('Assistant API error:', error);
            setMessages(prev => [...prev, { 
                id: Date.now() + 1, 
                text: "I'm having a bit of trouble connecting to my brain right now. Please try again in a moment!", 
                isBot: true 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col bg-[hsl(var(--surface))] rounded-3xl shadow-xl border border-[hsl(var(--border))] overflow-hidden transition-all duration-500">
            {/* Header */}
            <div className="px-8 py-6 border-b border-[hsl(var(--border))] bg-gradient-to-r from-primary-600/10 via-transparent to-transparent flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-600/20 relative rotate-3">
                        <Bot size={26} />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[hsl(var(--surface))] rounded-full animate-pulse"></span>
                    </div>
                    <div>
                        <h2 className="font-bold text-xl text-[hsl(var(--foreground))] tracking-tight">FinTrack Intelligence</h2>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <p className="text-sm text-[hsl(var(--muted))] font-medium">System Active</p>
                        </div>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-600/10 text-primary-600 dark:text-primary-400 rounded-xl text-xs font-bold uppercase tracking-widest border border-primary-600/20">
                    <Sparkles size={14} className="animate-spin-slow" />
                    Pro Advisor
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'} group animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                        <div className={`flex gap-4 max-w-[85%] lg:max-w-[70%] ${msg.isBot ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm transition-transform group-hover:scale-110 ${
                                msg.isBot 
                                    ? 'bg-primary-600 text-white' 
                                    : 'bg-[hsl(var(--border))] text-[hsl(var(--muted))]'
                            }`}>
                                {msg.isBot ? <Bot size={20} /> : <User size={20} />}
                            </div>
                            <div className={`relative px-6 py-4 rounded-2xl text-[16px] leading-relaxed shadow-sm transition-all ${
                                msg.isBot 
                                    ? 'bg-[hsl(var(--surface))] border border-[hsl(var(--border))] text-[hsl(var(--foreground))] rounded-tl-none hover:shadow-md' 
                                    : 'bg-primary-600 text-white rounded-tr-none hover:bg-primary-700'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-300">
                        <div className="flex gap-4 max-w-[80%]">
                            <div className="w-10 h-10 rounded-xl bg-primary-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-primary-600/20">
                                <Bot size={20} className="animate-bounce" />
                            </div>
                            <div className="px-6 py-5 rounded-2xl bg-[hsl(var(--surface))] border border-[hsl(var(--border))] rounded-tl-none flex items-center gap-2 shadow-sm">
                                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions & Input */}
            <div className="p-6 bg-[hsl(var(--surface))] border-t border-[hsl(var(--border))] shrink-0 space-y-4">
                {/* Quick Suggestions */}
                {messages.length === 1 && !isLoading && (
                    <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-2 duration-700">
                        {suggestions.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => handleSend(null, s.label)}
                                className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--surface))] border border-[hsl(var(--border))] hover:border-primary-500 hover:text-primary-600 text-[hsl(var(--muted))] rounded-xl text-sm font-medium transition-all hover:shadow-sm"
                            >
                                {s.icon}
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSend} className="relative flex items-center group">
                    <div className="absolute left-4 text-[hsl(var(--muted))] group-focus-within:text-primary-600 transition-colors">
                        <Sparkles size={20} />
                    </div>
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask anything about your finances..." 
                        className="w-full bg-[hsl(var(--background))] border border-[hsl(var(--border))] rounded-2xl py-4 pl-12 pr-14 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 text-[hsl(var(--foreground))] transition-all placeholder:text-[hsl(var(--muted))]/60"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2.5 w-11 h-11 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-primary-600/20 disabled:opacity-50 disabled:grayscale active:scale-95"
                    >
                        <Send size={20} className="ml-0.5" />
                    </button>
                </form>
                <p className="text-[10px] text-center text-[hsl(var(--muted))] uppercase tracking-widest font-bold opacity-50">
                    Powered by FinTrack AI Engine • v2.0
                </p>
            </div>
        </div>
    );
};

export default Assistant;
