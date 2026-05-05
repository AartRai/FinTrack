<?php

namespace App\Http\Controllers;

use App\Models\Income;
use Illuminate\Http\Request;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        $incomes = Income::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->get();
        return response()->json($incomes);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'source' => 'required|string',
            'amount' => 'required|numeric|min:0',
            'type' => 'required|string',
            'date' => 'required|date',
        ]);

        $validatedData['user_id'] = $request->user()->id;

        $income = Income::create($validatedData);

        return response()->json($income, 201);
    }

    public function destroy(Request $request, $id)
    {
        $income = Income::where('_id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $income->delete();

        return response()->json(['message' => 'Income deleted successfully']);
    }
}
