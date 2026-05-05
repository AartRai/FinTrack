<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Budget;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $month = $request->query('month', date('Y-m'));
        
        $monthStart = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        // 1. Get total expenses for the month
        $expenses = Expense::where('user_id', $userId)
            ->whereBetween('date', [$monthStart->format('Y-m-d'), $monthEnd->format('Y-m-d')])
            ->get();
            
        $totalExpenses = $expenses->sum('amount');
        
        // 2. Mock Income (since we don't have income tracker, let's assume a static income or an api field)
        // Usually, users would log income, for now let's set a fixed total income for demo purposes
        // or sum any 'Income' category expenses. Let's assume there is an 'Income' category.
        $totalIncome = Expense::where('user_id', $userId)
            ->whereBetween('date', [$monthStart->format('Y-m-d'), $monthEnd->format('Y-m-d')])
            ->where('category', 'Income')
            ->sum('amount');
            
        // Wait, normally income isn't an expense. Let's just mock total balance & income for the dashboard visual.
        $totalIncome = 60000;
        $totalBalance = $totalIncome - $totalExpenses;
        $savings = $totalBalance > 0 ? $totalBalance : 0;
        
        // 3. Category Breakdown (Pie chart data)
        // Group by category, sum amount
        $categoryBreakdown = $expenses->groupBy('category')->map(function($row) {
            return $row->sum('amount');
        })->map(function($amount, $category) {
            return ['name' => $category, 'value' => $amount];
        })->values();

        // 4. Daily Expenses (Line chart data)
        $dailyExpenses = $expenses->groupBy(function($item) {
            return Carbon::parse($item->date)->format('Y-m-d');
        })->map(function($row, $date) {
            return ['date' => $date, 'amount' => $row->sum('amount')];
        })->values()->sortBy('date')->values();

        // 5. Budget info
        $budget = Budget::where('user_id', $userId)->where('month', $month)->first();
        $budgetAmount = $budget ? $budget->amount : 30000; // default to 30000

        // 6. Recent Transactions
        $recentTransactions = Expense::where('user_id', $userId)
            ->orderBy('date', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'summary' => [
                'totalBalance' => $totalBalance,
                'totalExpenses' => $totalExpenses,
                'totalIncome' => $totalIncome,
                'savings' => $savings
            ],
            'budget' => [
                'amount' => $budgetAmount,
                'spent' => $totalExpenses,
                'remaining' => $budgetAmount - $totalExpenses
            ],
            'charts' => [
                'category' => $categoryBreakdown,
                'daily' => $dailyExpenses
            ],
            'recentTransactions' => $recentTransactions
        ]);
    }
}
