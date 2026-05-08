<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use App\Models\Goal;
use App\Models\Budget;
use Illuminate\Http\Request;

class InsightController extends Controller
{
    public function predictions(Request $request)
    {
        $user_id = $request->user()->_id;
        
        $totalExpenses = Expense::where('user_id', $user_id)->sum('amount');
        $expenseCount = Expense::where('user_id', $user_id)->count();
        
        $predictedExpense = 1500;
        if ($expenseCount > 0) {
            $predictedExpense = ($totalExpenses / $expenseCount) * 12; // Adjusted factor
        }

        return response()->json([
            'predicted_expense' => round($predictedExpense, 2),
            'recommendation' => __('messages.goals.reached', ['name' => 'Savings Goal']) // Placeholder for localized suggestion
        ]);
    }

    public function analyzeSpending(Request $request)
    {
        $user_id = $request->user()->_id;
        $expenses = Expense::where('user_id', $user_id)
            ->where('date', '>=', now()->startOfMonth())
            ->get();

        $total = $expenses->sum('amount');
        $categories = $expenses->groupBy('category')->map->sum('amount');
        
        $insights = [];
        if ($total > 0) {
            foreach ($categories as $category => $amount) {
                $percent = ($amount / $total) * 100;
                if ($percent > 35) {
                    $insights[] = "Your $category spending is high (" . round($percent) . "% of total). Consider setting a limit for this category.";
                }
            }
        }

        if (empty($insights)) {
            $insights[] = "Great job! Your spending is well-distributed across categories.";
        }

        return response()->json([
            'total_spent' => $total,
            'category_breakdown' => $categories,
            'insights' => $insights,
            'suggestion' => $total > 10000 ? "You're spending quite a bit this month. Have you reviewed your non-essentials?" : "You're doing great at managing your outflow."
        ]);
    }

    public function chat(Request $request)
    {
        $request->validate(['message' => 'required|string']);

        $user = $request->user();
        $message = strtolower($request->message);
        
        // Context Gathering
        $thisMonth = now()->format('Y-m');
        $expenses = Expense::where('user_id', $user->_id)->where('date', 'like', "$thisMonth%")->get();
        $incomes = Income::where('user_id', $user->_id)->where('date', 'like', "$thisMonth%")->get();
        $goals = Goal::where('user_id', $user->_id)->get();
        $budget = Budget::where('user_id', $user->_id)->where('month', $thisMonth)->first();
        
        $totalSpent = $expenses->sum('amount');
        $totalIncome = $incomes->sum('amount');
        $budgetLimit = $budget ? $budget->amount : 50000;
        
        $reply = "I'm your FinTrack AI assistant. I can help you with your budget, goals, and spending analysis. What's on your mind?";

        // Logic for different queries
        if ($this->matches($message, ['strategy', 'advice', 'help', 'tips'])) {
            $strategies = [
                "I suggest the 50/30/20 rule: 50% for Needs, 30% for Wants, and 20% for Savings/Debt.",
                "Try 'Zero-Based Budgeting' where every rupee is assigned a job before the month begins.",
                "Maintain your budget by tracking daily. Small leaks sink big ships!",
                "Always build an emergency fund of 3-6 months' expenses before aggressive investing."
            ];
            $reply = $strategies[array_rand($strategies)];
        } elseif ($this->matches($message, ['spent', 'how much', 'expense', 'spending'])) {
            $reply = "You've spent ₹" . number_format($totalSpent) . " this month. ";
            if ($totalSpent > $budgetLimit) {
                $reply .= "Warning: You are OVER your budget of ₹" . number_format($budgetLimit) . " by ₹" . number_format($totalSpent - $budgetLimit) . "!";
            } else {
                $reply .= "You have ₹" . number_format($budgetLimit - $totalSpent) . " remaining in your monthly budget.";
            }
        } elseif ($this->matches($message, ['income', 'earned', 'salary'])) {
            $reply = "Your total income recorded this month is ₹" . number_format($totalIncome) . ". ";
            if ($totalIncome > $totalSpent) {
                $reply .= "You're currently in the green with a surplus of ₹" . number_format($totalIncome - $totalSpent) . "!";
            } else {
                $reply .= "Be careful: Your expenses (₹" . number_format($totalSpent) . ") are exceeding your income!";
            }
        } elseif ($this->matches($message, ['goal', 'target', 'saving'])) {
            if ($goals->isEmpty()) {
                $reply = "You haven't set any financial goals yet. Setting a goal like 'Emergency Fund' or 'New Car' can help you stay motivated!";
            } else {
                $activeGoals = $goals->count();
                $completed = $goals->where('current', '>=', 'target')->count();
                $reply = "You have $activeGoals active goal(s). ";
                if ($completed > 0) $reply .= "Awesome! You've already reached $completed of them. ";
                
                $nearest = $goals->sortByDesc(fn($g) => ($g->current / $g->target))->first();
                if ($nearest && $nearest->current < $nearest->target) {
                    $percent = round(($nearest->current / $nearest->target) * 100);
                    $reply .= "You are closest to reaching '{$nearest->title}' ($percent% complete). Keep going!";
                }
            }
        } elseif ($this->matches($message, ['invest', 'stock', 'crypto', 'growth'])) {
            $reply = "For long-term growth, consider low-cost Index Funds or blue-chip stocks. If you're interested in crypto, keep it to a small percentage (e.g., 5%) of your portfolio due to high volatility.";
        } elseif ($this->matches($message, ['budget', 'limit'])) {
            $reply = "Your budget for this month is ₹" . number_format($budgetLimit) . ". You have utilized " . round(($totalSpent / max(1, $budgetLimit)) * 100) . "% of it.";
        } elseif ($this->matches($message, ['analyze', 'insight', 'pattern'])) {
            $topCat = $expenses->groupBy('category')->map->sum('amount')->sortDesc()->first();
            $catName = $expenses->groupBy('category')->map->sum('amount')->sortDesc()->keys()->first();
            if ($catName) {
                $reply = "Analysis: Your biggest expense is '$catName' (₹" . number_format($topCat) . "). If you cut this by 15%, you could save ₹" . number_format($topCat * 0.15) . " this month!";
            } else {
                $reply = "I need more transaction data to identify patterns. Add some expenses first!";
            }
        }

        return response()->json(['reply' => $reply]);
    }

    private function matches($message, $keywords)
    {
        foreach ($keywords as $word) {
            if (str_contains($message, $word)) return true;
        }
        return false;
    }
}
