<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $month = $request->query('month', date('Y-m'));
        $budget = Budget::where('user_id', $request->user()->id)->where('month', $month)->first();

        // return default if no budget set
        return response()->json($budget ?? ['amount' => 0, 'weekly_amount' => 0, 'month' => $month]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'amount' => 'sometimes|numeric|min:0',
            'weekly_amount' => 'sometimes|numeric|min:0',
            'month' => 'required|string', // Format: YYYY-MM
        ]);

        $budget = Budget::updateOrCreate(
            ['user_id' => $request->user()->id, 'month' => $validatedData['month']],
            array_filter($request->only(['amount', 'weekly_amount']))
        );

        return response()->json($budget, 201);
    }
}
