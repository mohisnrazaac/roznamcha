<?php

namespace App\Policies;

use App\Models\RationItem;
use App\Models\User;

class RationPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, RationItem $ration): bool
    {
        return $this->canManage($user, $ration);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, RationItem $ration): bool
    {
        return $this->canManage($user, $ration);
    }

    public function delete(User $user, RationItem $ration): bool
    {
        return $this->canManage($user, $ration);
    }

    protected function canManage(User $user, RationItem $ration): bool
    {
        return $user->isAdmin() || $ration->user_id === $user->id;
    }
}
