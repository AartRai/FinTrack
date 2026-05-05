import React, { useMemo } from 'react';
import { Download, BarChart2, FileText, FileSpreadsheet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { useData } from '../context/DataContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const Reports = () => {
    const { expenses, income } = useData();

    const data = useMemo(() => {
        const monthMap = {};
        const getMonthStr = (d) => new Date(d).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });

        expenses.forEach(e => {
            const m = getMonthStr(e.date);
            if (!monthMap[m]) monthMap[m] = { name: m, Income: 0, Expenses: 0 };
            monthMap[m].Expenses += e.amount;
        });

        income.forEach(i => {
            const m = getMonthStr(i.date);
            if (!monthMap[m]) monthMap[m] = { name: m, Income: 0, Expenses: 0 };
            monthMap[m].Income += i.amount;
        });

        return Object.values(monthMap).sort((a,b) => new Date(a.name) - new Date(b.name));
    }, [expenses, income]);

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("FinTrack Financial Report", 14, 15);
        
        // Prepare data for table
        const tableColumn = ["Date", "Type", "Category", "Title", "Amount"];
        const tableRows = [];

        // Combine and sort all transactions
        const allTransactions = [
            ...expenses.map(e => ({ ...e, type: 'Expense' })),
            ...income.map(i => ({ ...i, type: 'Income', category: i.source || 'Income' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        allTransactions.forEach(t => {
            const rowData = [
                new Date(t.date).toLocaleDateString(),
                t.type,
                t.category,
                t.title || t.source || '',
                `$${parseFloat(t.amount).toFixed(2)}`
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save(`FinTrack_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const exportCSV = () => {
        const allTransactions = [
            ...expenses.map(e => ({ date: e.date, type: 'Expense', category: e.category, title: e.title, amount: e.amount })),
            ...income.map(i => ({ date: i.date, type: 'Income', category: i.source || 'Income', title: i.source, amount: i.amount }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        const csv = Papa.unparse(allTransactions);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `FinTrack_Report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial Reports</h1>
                    <p className="text-slate-500 mt-1">Deep dive into your financial performance.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={exportCSV} className="flex items-center gap-2 text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
                        <FileSpreadsheet size={18} className="text-green-600" />
                        <span>Export CSV</span>
                    </button>
                    <button onClick={exportPDF} className="flex items-center gap-2 text-white bg-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors shadow-sm">
                        <FileText size={18} />
                        <span>Export PDF</span>
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="flex items-center gap-2 mb-6">
                    <BarChart2 className="text-primary-500" />
                    <h3 className="font-semibold text-slate-800">Cash Flow (Last 5 Months)</h3>
                </div>
                
                <div className="h-80 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(v) => v > 1000 ? v/1000+'k' : v} />
                            <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar dataKey="Income" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={50} />
                            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Reports;

