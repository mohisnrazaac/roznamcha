<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // Public landing page. No auth required.
        return Inertia::render('Home', [
            'authUser' => $request->user(), // may be null if guest
        ]);
    }
}
