<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request)
    {
        $user = $request->user();

        $user->update($request->validated());

        return response()->json([
            'message' => __('messages.profile.updated'),
            'user' => $user
        ]);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists and it's not a default URL
            if ($user->avatar && !str_starts_with($user->avatar, 'http')) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Store the uploaded file
            $path = $request->file('avatar')->store('avatars', 'public');
            
            $user->update([
                'avatar' => $path
            ]);

            return response()->json([
                'message' => __('messages.profile.avatar_uploaded'),
                'avatar_url' => asset('storage/' . $path),
                'user' => $user
            ]);
        }

        return response()->json(['message' => 'No file uploaded'], 400);
    }
}
