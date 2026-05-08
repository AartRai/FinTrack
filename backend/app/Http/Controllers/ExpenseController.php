<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Http\Requests\StoreExpenseRequest;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::where('user_id', $request->user()->_id);

        if ($request->has('category') && $request->category !== 'All') {
            $query->where('category', $request->category);
        }

        if ($request->has('month')) {
            $query->where('date', 'like', $request->month . '%');
        }

        $expenses = $query->orderBy('date', 'desc')->get();
        return response()->json($expenses);
    }

    public function store(StoreExpenseRequest $request)
    {
        $validatedData = $request->validated();
        $validatedData['user_id'] = $request->user()->_id;

        $expense = Expense::create($validatedData);

        return response()->json([
            'message' => __('messages.expenses.created'),
            'expense' => $expense
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $expense = Expense::where('_id', $id)->where('user_id', $request->user()->_id)->firstOrFail();
        return response()->json($expense);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::where('_id', $id)->where('user_id', $request->user()->_id)->firstOrFail();

        $validatedData = $request->validate([
            'title' => 'sometimes|string',
            'amount' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string',
            'date' => 'sometimes|date',
            'description' => 'nullable|string',
        ]);

        $expense->update($validatedData);

        return response()->json([
            'message' => __('messages.expenses.updated'),
            'expense' => $expense
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $expense = Expense::where('_id', $id)->where('user_id', $request->user()->_id)->firstOrFail();
        $expense->delete();

        return response()->json(['message' => __('messages.expenses.deleted')]);
    }
}
