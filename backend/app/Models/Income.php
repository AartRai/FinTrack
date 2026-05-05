<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Income extends Model
{
    protected $fillable = [
        'user_id',
        'source',
        'amount',
        'type',
        'date',
    ];

    protected $casts = [
        'date' => 'datetime',
        'amount' => 'float',
    ];
}
