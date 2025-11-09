<?php

namespace App\Http\Controllers;

use App\Models\Household;
use App\Services\Reports\SurvivalReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class SurvivalReportController extends Controller
{
    public function __construct(private readonly SurvivalReportService $service)
    {
    }

    public function generate(Request $request)
    {
        $validated = $request->validate([
            'month' => ['required', 'date_format:Y-m'],
        ]);

        /** @var Household|null $household */
        $household = app()->bound('currentHousehold') ? app('currentHousehold') : null;

        if (! $household) {
            abort(400, 'Household context unavailable.');
        }

        $url = $this->service->generate(
            $request->user(),
            $household,
            Carbon::createFromFormat('Y-m', $validated['month'])->startOfMonth()
        );

        return back()->with('report_download_url', $url);
    }
}
