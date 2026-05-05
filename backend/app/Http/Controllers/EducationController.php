<?php
/*
Innovative Software Solutions - Finance: Financial Literacy Gamification
*/

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EducationController extends Controller
{
    public function getQuiz()
    {
        $quizzes = [
            [
                'id' => 1,
                'question' => 'What is the "50/30/20 rule" in budgeting?',
                'options' => [
                    '50% Needs, 30% Wants, 20% Savings',
                    '50% Savings, 30% Needs, 20% Wants',
                    '50% Wants, 30% Savings, 20% Needs',
                    '50% Needs, 30% Debt, 20% Fun'
                ],
                'answer' => 0,
                'explanation' => 'The 50/30/20 rule is a simple budgeting method that helps you manage your money effectively, allocating 50% to needs, 30% to wants, and 20% to savings.'
            ],
            [
                'id' => 2,
                'question' => 'What is an "Emergency Fund"?',
                'options' => [
                    'Money for a new car',
                    'Money saved for unexpected expenses like medical bills or repairs',
                    'Money for a vacation',
                    'Money for buying stocks'
                ],
                'answer' => 1,
                'explanation' => 'An emergency fund is a stash of money set aside to cover the financial surprises life throws your way.'
            ],
            [
                'id' => 3,
                'question' => 'What does "Compound Interest" mean?',
                'options' => [
                    'Interest paid only on the original amount',
                    'Interest calculated on the principal and also on the accumulated interest of previous periods',
                    'A type of interest that never changes',
                    'Interest paid by the government'
                ],
                'answer' => 1,
                'explanation' => 'Compound interest is the interest on a loan or deposit calculated based on both the initial principal and the accumulated interest from previous periods.'
            ]
        ];

        return response()->json($quizzes);
    }

    public function submitQuiz(Request $request)
    {
        $request->validate([
            'score' => 'required|integer',
            'total' => 'required|integer'
        ]);

        // In a real app, we would save the score to the user profile in MongoDB
        return response()->json([
            'message' => 'Quiz submitted successfully!',
            'badge' => $request->score == $request->total ? 'Financial Wizard 🧙' : 'Finance Student 📚'
        ]);
    }
}
