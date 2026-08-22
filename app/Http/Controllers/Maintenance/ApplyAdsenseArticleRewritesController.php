<?php

namespace App\Http\Controllers\Maintenance;

use App\Actions\Blog\ApplyAdsenseArticleRewrites;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplyAdsenseArticleRewritesController extends Controller
{
    public function __invoke(Request $request, ApplyAdsenseArticleRewrites $action): JsonResponse
    {
        $configuredToken = (string) config('maintenance.secret', '');
        $providedToken = (string) $request->query('token', '');

        abort_unless(
            $configuredToken !== '' && hash_equals($configuredToken, $providedToken),
            403
        );

        $result = $action->run($request->boolean('dry_run'));

        return response()->json([
            'ok' => true,
            ...$result,
            'production_urls' => collect($result['updates'])
                ->map(fn (array $update): string => 'https://roznamcha.pk/blog/'.$update['slug'])
                ->values()
                ->all(),
        ]);
    }
}
