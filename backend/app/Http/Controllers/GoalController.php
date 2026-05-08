<?php

namespace App\Http\Controllers;

use App\Models\Goal;
use App\Mail\GoalReached;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class GoalController extends Controller
{
    public function index(Request $request)
    {
        $goals = Goal::where('user_id', $request->user()->_id)->get();
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

        $validatedData['user_id'] = $request->user()->_id;

        $goal = Goal::create($validatedData);

        return response()->json([
            'message' => __('messages.goals.created'),
            'goal' => $goal
        ], 201);
    }

    public function updateProgress(Request $request, $id)
    {
        $goal = Goal::where('_id', $id)->where('user_id', $request->user()->_id)->firstOrFail();

        $validatedData = $request->validate([
            'current' => 'required|numeric|min:0',
        ]);

        $oldProgress = ($goal->current / $goal->target) * 100;
        
        $goal->update(['current' => $validatedData['current']]);
        
        $newProgress = ($goal->current / $goal->target) * 100;

        // Trigger email if goal just reached 100%
        if ($oldProgress < 100 && $newProgress >= 100) {
            Mail::to($request->user()->email)->send(new GoalReached($goal));
        }

        return response()->json([
            'message' => __('messages.goals.updated'),
            'goal' => $goal
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $goal = Goal::where('_id', $id)->where('user_id', $request->user()->_id)->firstOrFail();
        $goal->delete();

        return response()->json(['message' => __('messages.goals.deleted')]);
    }
}
