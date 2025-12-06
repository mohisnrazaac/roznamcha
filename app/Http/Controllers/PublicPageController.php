<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class PublicPageController extends Controller
{
    public function home(): Response
    {
        return Inertia::render('Public/Home');
    }

    public function kharchaMap(): Response
    {
        return Inertia::render('Public/KharchaMap');
    }

    public function rationBrain(): Response
    {
        return Inertia::render('Public/RationBrain');
    }

    public function survivalReport(): Response
    {
        return Inertia::render('Public/SurvivalReport');
    }

    public function about(): Response
    {
        return Inertia::render('Public/About');
    }
}
