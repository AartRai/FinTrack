<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class InsightController extends Controller
{
    public function predictions(Request $request)
    {
        $user_id = $request->user()->id;
        
        // Simple prediction: average of all expenses.
        // In a real app, group by month for the last 3-6 months.
        $totalExpenses = Expense::where('user_id', $user_id)->sum('amount');
        $expenseCount = Expense::where('user_id', $user_id)->count();
        
        // Assume avg expense per entry * 30 to get a rough monthly estimate if we don't have months
        // Better yet: just return a mock prediction based on recent expenses.
        
        $predictedExpense = 0;
        if ($expenseCount > 0) {
            $predictedExpense = ($totalExpenses / $expenseCount) * 15; // random factor for mock
        } else {
            $predictedExpense = 1500; // default
        }

        return response()->json([
            'predicted_expense' => round($predictedExpense, 2),
            'recommendation' => 'Based on your recent trends, try reducing dining out to save an extra $50 this month.'
        ]);
    }

    public function analyzeSpending(Request $request)
    {
        $user_id = $request->user()->id;
        $expenses = Expense::where('user_id', $user_id)
            ->where('date', '>=', now()->startOfMonth())
            ->get();

        $total = $expenses->sum('amount');
        $categories = $expenses->groupBy('category')->map->sum('amount');
        
        $insights = [];
        
        if ($total > 0) {
            foreach ($categories as $category => $amount) {
                $percent = ($amount / $total) * 100;
                if ($percent > 40) {
                    $insights[] = "You've spent " . round($percent) . "% of your budget on $category. Consider looking for ways to cut back here.";
                }
            }
        }

        if (empty($insights)) {
            $insights[] = "Your spending is well-balanced this month. Keep it up!";
        }

        return response()->json([
            'total_spent' => $total,
            'category_breakdown' => $categories,
            'insights' => $insights,
            'suggestion' => $total > 5000 ? "Try setting a tighter budget for next month to boost your savings." : "You're on track to meet your savings goals."
        ]);
    }

    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $user = $request->user();
        $message = strtolower($request->message);
        
        // Fetch context for "AI"
        $expenses = Expense::where('user_id', $user->id)
            ->where('date', '>=', now()->startOfMonth())
            ->get();
        $totalSpent = $expenses->sum('amount');
        
        // Use a default or fetch from budget table if exists (assuming it exists based on routes)
        $budget = \App\Models\Budget::where('user_id', $user->id)
            ->where('month', now()->format('Y-m'))
            ->first();
        $budgetLimit = $budget ? $budget->amount : 50000; // fallback

        $reply = "I'm your FinTrack AI assistant. I can help you understand your spending patterns.";

        if (str_contains($message, 'strategy') || str_contains($message, 'how to') || str_contains($message, 'maintain') || str_contains($message, 'advice')) {
            $strategies = [
                "I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. It's a gold standard for personal finance.",
                "Try the 'Pay Yourself First' strategy. Move 10-20% of your income to savings as soon as you get paid, before you spend on anything else.",
                "To maintain your budget, try checking your FinTrack dashboard every morning. Awareness is the best tool for control.",
                "If you're over budget in one category, try to cut back in another for the rest of the month to balance it out."
            ];
            $reply = $strategies[array_rand($strategies)];
        } elseif (str_contains($message, 'how') && (str_contains($message, 'spending') || str_contains($message, 'spent'))) {
            $reply = "This month, you've spent ₹" . number_format($totalSpent) . ". ";
            if ($totalSpent > ($budgetLimit * 0.8)) {
                $reply .= "You're approaching your budget limit of ₹" . number_format($budgetLimit) . ". It might be time to be more cautious with non-essential spending.";
            } else {
                $reply .= "You're well within your budget limit of ₹" . number_format($budgetLimit) . ". Great job staying on track!";
            }
        } elseif (str_contains($message, 'budget')) {
            $percent = $budgetLimit > 0 ? round(($totalSpent / $budgetLimit) * 100) : 0;
            $reply = "Your current budget is ₹" . number_format($budgetLimit) . ". You have utilized " . $percent . "% of it so far this month.";
        } elseif (str_contains($message, 'analyze') || str_contains($message, 'insight')) {
            $topCategory = $expenses->groupBy('category')->map->sum('amount')->sortDesc()->head(1);
            if ($topCategory->isNotEmpty()) {
                $catName = $topCategory->keys()->first();
                $catAmount = $topCategory->first();
                $reply = "Analyzing your spending... Your highest expense category is '$catName' at ₹" . number_format($catAmount) . ". Reducing this by just 10% could save you ₹" . number_format($catAmount * 0.1) . " this month!";
            } else {
                $reply = "I don't see enough expense data yet to give a deep analysis. Try adding some transactions first!";
            }
        } elseif (str_contains($message, 'invest')) {
            $reply = "Based on your current savings potential, I recommend looking into low-cost Index Funds or ETFs. But first, ensure you have at least 3 months of expenses in an emergency fund!";
        } elseif (str_contains($message, 'save') || str_contains($message, 'saving')) {
            $potentialSavings = max(0, $budgetLimit - $totalSpent);
            $reply = "You currently have a potential savings gap of ₹" . number_format($potentialSavings) . " for this month. Automating a transfer of even 10% of your income at the start of the month is a proven way to build wealth.";
        }

        return response()->json([
            'reply' => $reply
        ]);
    }
}
