<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'color'];

    public function kharchaEntries(): HasMany
    {
        return $this->hasMany(KharchaEntry::class);
    }
}
