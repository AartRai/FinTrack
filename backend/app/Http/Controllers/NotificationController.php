<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\Expense;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user_id = $request->user()->id;
        $currentMonth = date('Y-m');
        
        $notifications = [];

        // Budget Alerts
        $budget = Budget::where('user_id', $user_id)->where('month', $currentMonth)->first();
        if ($budget && $budget->amount > 0) {
            $totalExpenses = Expense::where('user_id', $user_id)
                ->where('date', 'like', $currentMonth . '%')
                ->sum('amount');
            
            $percentage = ($totalExpenses / $budget->amount) * 100;
            
            if ($percentage >= 100) {
                $notifications[] = [
                    'id' => uniqid(),
                    'type' => 'alert',
                    'title' => 'Budget Exceeded',
                    'message' => 'You have exceeded your budget of $' . $budget->amount . ' for this month.',
                    'date' => date('Y-m-d\TH:i:s\Z')
                ];
            } elseif ($percentage >= 80) {
                $notifications[] = [
                    'id' => uniqid(),
                    'type' => 'warning',
                    'title' => 'Nearing Budget Limit',
                    'message' => 'You have spent ' . number_format($percentage, 0) . '% of your budget for this month.',
                    'date' => date('Y-m-d\TH:i:s\Z')
                ];
            }
        }

        // Mock Bill Reminder
        $notifications[] = [
            'id' => uniqid(),
            'type' => 'info',
            'title' => 'Upcoming Bill',
            'message' => 'Your electricity bill is estimated to be due in 3 days.',
            'date' => date('Y-m-d\TH:i:s\Z')
        ];

        // Mock Savings Suggestion
        $notifications[] = [
            'id' => uniqid(),
            'type' => 'success',
            'title' => 'Savings Opportunity',
            'message' => 'Consider moving $150 to your savings account based on your recent spending habits.',
            'date' => date('Y-m-d\TH:i:s\Z')
        ];

        return response()->json($notifications);
    }
}
