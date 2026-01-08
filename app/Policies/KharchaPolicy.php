<?php

namespace App\Policies;

use App\Models\Expense;
use App\Models\User;

class KharchaPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Expense $expense): bool
    {
        return $this->canManage($user, $expense);
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Expense $expense): bool
    {
        return $this->canManage($user, $expense);
    }

    public function delete(User $user, Expense $expense): bool
    {
        return $this->canManage($user, $expense);
    }

    protected function canManage(User $user, Expense $expense): bool
    {
        return $user->isAdmin() || (int) $expense->user_id === (int) $user->id;
    }
}
