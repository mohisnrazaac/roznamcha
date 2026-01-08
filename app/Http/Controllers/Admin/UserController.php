<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\RationItem;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', User::class);

        $users = User::query()
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['required', 'in:admin,user'],
        ]);

        if (! $request->user()->isAdmin() && $data['role'] === 'admin') {
            abort(403);
        }

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role' => $data['role'],
        ]);

        return redirect()->route('admin.users.index')->with('success', 'User created.');
    }

    public function show(User $user): Response
    {
        $this->authorize('view', $user);

        $dateColumn = $this->expenseDateColumn();
        $noteColumn = $this->expenseNoteColumn();
        $nameColumn = $this->rationNameColumn();
        $statusColumn = Schema::hasColumn('ration_items', 'is_active') ? 'is_active' : null;

        $kharchaCount = Expense::where('user_id', $user->id)->count();
        $rationCount = RationItem::where('user_id', $user->id)->count();

        $kharchas = Expense::query()
            ->with('category')
            ->where('user_id', $user->id)
            ->orderByDesc($dateColumn)
            ->orderByDesc('id')
            ->limit(50)
            ->get()
            ->map(fn (Expense $expense) => [
                'id' => $expense->id,
                'amount' => (float) $expense->amount,
                'date' => optional($expense->{$dateColumn})->toDateString(),
                'note' => $noteColumn ? ($expense->{$noteColumn} ?? null) : null,
                'category' => $expense->category ? [
                    'id' => $expense->category->id,
                    'name' => $expense->category->name,
                ] : null,
            ]);

        $rationItems = RationItem::query()
            ->where('user_id', $user->id)
            ->orderBy($nameColumn)
            ->limit(50)
            ->get()
            ->map(function (RationItem $item) use ($nameColumn, $statusColumn) {
                return [
                    'id' => $item->id,
                    'name' => $item->{$nameColumn},
                    'unit' => $item->unit,
                    'is_active' => $statusColumn ? (bool) $item->{$statusColumn} : true,
                ];
            });

        return Inertia::render('Admin/Users/Show', [
            'managedUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'created_at' => $user->created_at?->toDateTimeString(),
                'kharcha_count' => $kharchaCount,
                'ration_count' => $rationCount,
            ],
            'kharchas' => $kharchas,
            'rationItems' => $rationItems,
        ]);
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        $kharchaCount = Expense::where('user_id', $user->id)->count();
        $rationCount = RationItem::where('user_id', $user->id)->count();
        $hasRelatedRecords = $kharchaCount > 0 || $rationCount > 0;

        if ($hasRelatedRecords && ! $request->boolean('force')) {
            $message = sprintf(
                '%s still has %d kharcha and %d ration entries. Force delete to remove everything.',
                $user->name,
                $kharchaCount,
                $rationCount
            );

            return redirect()->back()->with('error', $message);
        }

        DB::transaction(function () use ($user): void {
            Expense::where('user_id', $user->id)->delete();
            RationItem::where('user_id', $user->id)->delete();
            $user->delete();
        });

        return redirect()->route('admin.users.index')->with('success', 'User removed.');
    }

    public function destroyKharcha(User $user, Expense $expense): RedirectResponse
    {
        $this->authorize('delete', $expense);

        if ($expense->user_id !== $user->id) {
            abort(404);
        }

        $expense->delete();

        return redirect()->back()->with('success', 'Expense removed.');
    }

    public function destroyRation(User $user, RationItem $ration): RedirectResponse
    {
        $this->authorize('delete', $ration);

        if ($ration->user_id !== $user->id) {
            abort(404);
        }

        $ration->delete();

        return redirect()->back()->with('success', 'Ration item removed.');
    }

    private function expenseDateColumn(): string
    {
        if (Schema::hasColumn('expenses', 'tx_date')) {
            return 'tx_date';
        }

        if (Schema::hasColumn('expenses', 'date')) {
            return 'date';
        }

        return 'tx_date';
    }

    private function expenseNoteColumn(): ?string
    {
        if (Schema::hasColumn('expenses', 'note')) {
            return 'note';
        }

        if (Schema::hasColumn('expenses', 'notes')) {
            return 'notes';
        }

        if (Schema::hasColumn('expenses', 'description')) {
            return 'description';
        }

        return null;
    }

    private function rationNameColumn(): string
    {
        return Schema::hasColumn('ration_items', 'name') ? 'name' : 'item_name';
    }
}
