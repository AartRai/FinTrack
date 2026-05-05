<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'amount',
        'category',
        'date',
        'description',
    ];

    protected $casts = [
        'date' => 'datetime',
        'amount' => 'float',
    ];
}
