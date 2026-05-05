<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::where('user_id', $request->user()->id);

        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->has('month')) {
            // Very simple month filter assume YYYY-MM
            $query->where('date', 'like', $request->month . '%');
        }

        $expenses = $query->orderBy('date', 'desc')->get();
        return response()->json($expenses);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $validatedData['user_id'] = $request->user()->id;

        $expense = Expense::create($validatedData);

        return response()->json($expense, 201);
    }

    public function show(Request $request, $id)
    {
        $expense = Expense::where('_id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        return response()->json($expense);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::where('_id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $validatedData = $request->validate([
            'title' => 'sometimes|string',
            'amount' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string',
            'date' => 'sometimes|date',
            'description' => 'nullable|string',
        ]);

        $expense->update($validatedData);

        return response()->json($expense);
    }

    public function destroy(Request $request, $id)
    {
        $expense = Expense::where('_id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully']);
    }
}
