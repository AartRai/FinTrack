<?php

namespace App\Models;

use MongoDB\Laravel\Eloquent\Model;

class Goal extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'target',
        'current',
        'color',
    ];

    protected $casts = [
        'target' => 'float',
        'current' => 'float',
    ];
}
