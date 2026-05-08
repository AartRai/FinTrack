<!DOCTYPE html>
<html>
<head>
    <title>Goal Reached!</title>
    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); max-width: 600px; margin: auto; }
        h1 { color: #2d3748; }
        p { color: #4a5568; line-height: 1.6; }
        .congrats { font-size: 24px; color: #48bb78; font-weight: bold; }
        .footer { margin-top: 30px; font-size: 12px; color: #a0aec0; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <p class="congrats">Congratulations, {{ $goal->user->name }}!</p>
        <h1>You've reached your goal!</h1>
        <p>We're thrilled to let you know that you've successfully reached your financial goal: <strong>{{ $goal->title }}</strong>.</p>
        <p>Total Saved: <strong>₹{{ number_format($goal->target, 2) }}</strong></p>
        <p>Keep up the great work and continue building your financial future!</p>
        <div class="footer">
            &copy; {{ date('Y') }} FinTrack. All rights reserved.
        </div>
    </div>
</body>
</html>
