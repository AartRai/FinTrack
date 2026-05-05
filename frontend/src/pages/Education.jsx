import React, { useState } from 'react';
import { BookOpen, PieChart, Shield, TrendingUp, PlayCircle, X } from 'lucide-react';

const topics = [
    {
        id: 1,
        title: "The 50/30/20 Rule",
        category: "Budgeting",
        icon: <PieChart size={24} className="text-blue-500" />,
        bg: "bg-blue-50",
        desc: "Learn how to split your income: 50% on needs, 30% on wants, and 20% on savings.",
        time: "5 min read",
        content: "The 50/30/20 rule is a simple and effective budgeting method that can help you manage your money simply and sustainably. The basic rule is to divide up after-tax income and allocate it to spend: 50% on needs, 30% on wants, and socking away 20% to savings. Needs are those bills that you absolutely must pay and are the things necessary for survival. Wants are all the things you spend money on that are not absolutely essential. Savings can include money added to an emergency fund, a retirement account, or investing in the stock market."
    },
    {
        id: 2,
        title: "Building an Emergency Fund",
        category: "Saving",
        icon: <Shield size={24} className="text-green-500" />,
        bg: "bg-green-50",
        desc: "Why you need 3-6 months of living expenses saved and how to start building it.",
        time: "4 min read",
        content: "An emergency fund is a stash of money set aside to cover the financial surprises life throws your way. These unexpected events can be stressful and costly. Some common emergencies include job loss, medical or dental emergencies, unexpected home repairs, or car troubles. Having an emergency fund gives you a financial buffer that can keep you afloat in a time of need without having to rely on credit cards or high-interest loans. Start by saving a small amount regularly until you reach a goal of three to six months' worth of living expenses."
    },
    {
        id: 3,
        title: "Introduction to Index Funds",
        category: "Investing",
        icon: <TrendingUp size={24} className="text-indigo-500" />,
        bg: "bg-indigo-50",
        desc: "A beginner-friendly guide to passive investing and why it works long-term.",
        time: "8 min read",
        content: "An index fund is a type of mutual fund or exchange-traded fund (ETF) with a portfolio constructed to match or track the components of a financial market index, such as the Standard & Poor's 500 Index (S&P 500). An index mutual fund is said to provide broad market exposure, low operating expenses, and low portfolio turnover. These funds follow their benchmark index regardless of the state of the markets. Index funds are generally considered ideal core portfolio holdings for retirement accounts."
    },
    {
        id: 4,
        title: "Understanding Credit Scores",
        category: "Credit",
        icon: <BookOpen size={24} className="text-purple-500" />,
        bg: "bg-purple-50",
        desc: "What makes up your credit score and actionable tips to improve it safely.",
        time: "6 min read",
        content: "A credit score is a number between 300–850 that depicts a consumer's creditworthiness. The higher the score, the better a borrower looks to potential lenders. A credit score is based on credit history: number of open accounts, total levels of debt, and repayment history, and other factors. Lenders use credit scores to evaluate the probability that an individual will repay loans in a timely manner. You can improve your score by paying bills on time, keeping balances low on credit cards, and opening new credit accounts only when needed."
    }
];

const Education = () => {
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [showVideo, setShowVideo] = useState(false);

    return (
        <div className="space-y-6 relative">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial Literacy</h1>
                <p className="text-slate-500 mt-1">Master your money with our bite-sized lessons.</p>
            </div>

            {/* Featured Video */}
            <div className="card bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden relative">
                <div className="relative z-10 p-6 md:w-2/3">
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm">Featured Lesson</span>
                    <h2 className="text-3xl font-bold mb-3">How to Start Investing with Just ₹1,000</h2>
                    <p className="text-slate-300 mb-6 leading-relaxed">Don't wait until you're rich to invest. Discover how compounding interest can turn small, consistent investments into massive wealth.</p>
                    <button 
                        onClick={() => setShowVideo(true)}
                        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        <PlayCircle size={20} />
                        Watch Video
                    </button>
                </div>
                {/* Abstract shape */}
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
                <div className="absolute right-10 top-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Modules Grid */}
            <h3 className="font-semibold text-slate-800 text-lg mt-8 mb-4">Explore Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                {topics.map(topic => (
                    <div 
                        key={topic.id} 
                        onClick={() => setSelectedArticle(topic)}
                        className="card hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-slate-200 group flex flex-col"
                    >
                        <div className={`w-12 h-12 ${topic.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                            {topic.icon}
                        </div>
                        <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{topic.category}</span>
                        <h4 className="font-bold text-slate-800 mt-2 mb-2 line-clamp-1">{topic.title}</h4>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-4">{topic.desc}</p>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                            <span className="text-xs text-slate-400 font-medium">{topic.time}</span>
                            <span className="text-sm font-medium text-primary-600 group-hover:underline flex items-center gap-1">Read more &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="font-bold text-slate-800">How to Start Investing with Just ₹1,000</h3>
                            <button onClick={() => setShowVideo(false)} className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="aspect-video w-full bg-slate-900 relative">
                            {/* Embedded YouTube Video placeholder - using a generic investing video */}
                            <iframe 
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/0jRQk8Xkvxg?autoplay=1" 
                                title="Investing for Beginners" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            {/* Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${selectedArticle.bg} rounded-xl flex items-center justify-center`}>
                                    {selectedArticle.icon}
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">{selectedArticle.category}</span>
                                    <h3 className="font-bold text-lg text-slate-800">{selectedArticle.title}</h3>
                                </div>
                            </div>
                            <button onClick={() => setSelectedArticle(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <div className="prose prose-slate prose-blue max-w-none">
                                <p className="text-slate-600 leading-relaxed text-lg mb-6">{selectedArticle.desc}</p>
                                <div className="h-px w-full bg-slate-100 mb-6"></div>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {selectedArticle.content}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                            <button onClick={() => setSelectedArticle(null)} className="btn-primary">Mark as Read</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Education;
