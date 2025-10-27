<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Category extends Model {
    protected $fillable = ['user_id','name','color_code','icon'];
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    public function expenses(): HasMany {
        return $this->hasMany(Expense::class);
    }
}
