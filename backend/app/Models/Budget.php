<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'weekly_amount',
        'month',
    ];

    protected $casts = [
        'amount' => 'float',
        'weekly_amount' => 'float',
    ];
}
