<?php
// Purpose: Render programmatic SEO landing pages without touching existing public controllers. Date: 2026-03-29. Author: Mohsin.

namespace App\Http\Controllers;

use App\Seo\SeoPageDataService;
use Inertia\Inertia;
use Inertia\Response;

class SeoPageController extends Controller
{
    public function __construct(private readonly SeoPageDataService $pageDataService)
    {
    }

    public function petrol(string $city): Response
    {
        return Inertia::render('SEO/Petrol', $this->pageDataService->petrol($city));
    }

    public function electricity(string $disco): Response
    {
        return Inertia::render('SEO/Electricity', $this->pageDataService->electricity($disco));
    }

    public function ration(int|string $size): Response
    {
        return Inertia::render('SEO/Ration', $this->pageDataService->ration($size));
    }
}
