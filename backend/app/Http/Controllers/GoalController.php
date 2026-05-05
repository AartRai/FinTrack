<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use Illuminate\Http\Request;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = Goal::where('user_id', $request->user()->id)->get();
        return response()->json($goals);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string',
            'target' => 'required|numeric|min:0',
            'current' => 'required|numeric|min:0',
            'color' => 'required|string',
        ]);

        $validatedData['user_id'] = $request->user()->id;

        $goal = Goal::create($validatedData);

        return response()->json($goal, 201);
    }

    public function updateProgress(Request $request, $id)
    {
        $goal = Goal::where('_id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $validatedData = $request->validate([
            'current' => 'required|numeric|min:0',
        ]);

        $goal->update(['current' => $validatedData['current']]);

        return response()->json($goal);
    }

    public function destroy(Request $request, $id)
    {
        $goal = Goal::where('_id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $goal->delete();

        return response()->json(['message' => 'Goal deleted successfully']);
    }
}
