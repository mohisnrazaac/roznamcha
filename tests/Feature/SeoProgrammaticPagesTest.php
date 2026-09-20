<?php
// Purpose: Verify programmatic SEO pages, sitemap output, and snapshot refresh behavior. Date: 2026-03-29. Author: Mohsin.

namespace Tests\Feature;

use App\Models\SeoPageSnapshot;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SeoProgrammaticPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
    }

    public function test_petrol_page_is_noindex_when_no_verified_snapshot_exists(): void
    {
        $this->get('/petrol-price-karachi-today')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('SEO/Petrol')
                ->where('pageType', 'petrol')
                ->where('pageKey', 'karachi')
                ->where('metaTitle', 'Petrol Price in Karachi Today | Roznamcha Pakistan')
                ->where('robots', 'noindex,follow')
                ->where('isIndexable', false)
                ->where('sourceLabel', 'Official and backup fuel sources pending sync')
                ->where('dataPoints.0.value', 'Pending sync')
                ->where('dataPoints.1.value', 'Noindex until verified')
                ->where('helperContent.0.heading', 'Why Karachi is still waiting for fuel data')
                ->where('helperContent.1.heading', 'What will unlock indexing')
                ->has('internalLinks')
                ->has('faqItems', 3)
            );
    }

    public function test_invalid_programmatic_routes_return_not_found(): void
    {
        $this->get('/petrol-price-faisalabad-today')->assertNotFound();
        $this->get('/electricity-bill-calculator-fesco')->assertNotFound();
        $this->get('/ration-cost-for-10-people-pakistan')->assertNotFound();
    }

    public function test_verified_petrol_snapshot_is_preferred_when_available(): void
    {
        $snapshot = SeoPageSnapshot::query()->create([
            'page_type' => 'petrol',
            'page_key' => 'karachi',
            'title' => 'Petrol price in Karachi today',
            'value_1' => 321.17,
            'value_2' => 321.17,
            'value_3' => 0.00,
            'summary_text' => 'Official Petroleum Division petrol pricing places Motor Spirit (MS) at PKR 321.17 per litre for Pakistan, which is the same notified rate households in Karachi can use as today\'s planning benchmark.',
            'comparison_text' => 'Official notified petrol price for Karachi is unchanged from the previous Petroleum Division update.',
            'effective_date' => '2026-03-28',
            'source_label' => 'Government of Pakistan - Petroleum Division',
            'extra_json' => [
                'has_verified_data' => true,
                'is_indexable' => true,
                'notice_title' => 'Prices of Petroleum Products from 28th March, 2026',
                'source_url' => 'https://petroleum.gov.pk/NewsDetail/NDNhYTRmZDktMDMzYS00NzRlLWI4NmQtMzgyNzdjMGM1Njli',
                'source_asset_url' => 'https://petroleum.gov.pk/SiteImage/Misc/images/Petrol%20Prices%20wef%2028_3_2026.jpeg',
            ],
        ]);

        $snapshot->forceFill([
            'updated_at' => Carbon::parse('2026-03-29 09:00:00', 'Asia/Karachi'),
        ])->save();

        Cache::flush();

        $this->get('/petrol-price-karachi-today')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('summaryText', 'Official Petroleum Division petrol pricing places Motor Spirit (MS) at PKR 321.17 per litre for Pakistan, which is the same notified rate households in Karachi can use as today\'s planning benchmark.')
                ->where('comparisonText', 'Official notified petrol price for Karachi is unchanged from the previous Petroleum Division update.')
                ->where('robots', 'noindex,follow')
                ->where('isIndexable', false)
                ->where('sourceLabel', 'Government of Pakistan - Petroleum Division')
                ->where('sourceUrl', 'https://petroleum.gov.pk/NewsDetail/NDNhYTRmZDktMDMzYS00NzRlLWI4NmQtMzgyNzdjMGM1Njli')
                ->where('noticeTitle', 'Prices of Petroleum Products from 28th March, 2026')
                ->where('dataPoints.0.value', 'PKR 321.17 per litre')
                ->where('dataPoints.1.value', 'PKR 321.17 per litre')
                ->where('dataPoints.2.value', 'PKR 0.00')
            );
    }

    public function test_electricity_and_ration_pages_render_unique_metadata(): void
    {
        $this->get('/electricity-bill-calculator-lesco')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('SEO/Electricity')
                ->where('metaTitle', 'Electricity Bill Calculator for LESCO | Roznamcha')
                ->where('title', 'Electricity Bill Calculator for LESCO')
                ->where('summaryText', fn (string $summary) => str_contains($summary, 'LESCO residential billing around PKR '))
                ->where('helperContent.0.heading', 'What the LESCO estimate covers')
                ->where('helperContent.2.heading', 'How to use the examples')
                ->where('robots', 'noindex,follow')
                ->where('isIndexable', false)
            );

        $this->get('/ration-cost-for-6-people-pakistan')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('SEO/Ration')
                ->where('metaTitle', 'Ration Cost for 6 People in Pakistan | Roznamcha')
                ->where('title', 'Ration Cost for 6 People in Pakistan')
                ->where('summaryText', fn (string $summary) => str_contains($summary, 'Latest internal household basket estimate for a 6-person family is PKR '))
                ->where('helperContent.0.heading', 'What a 6-person ration estimate means')
                ->where('helperContent.2.heading', 'How to turn this into action')
                ->where('robots', 'noindex,follow')
                ->where('isIndexable', false)
            );
    }

    public function test_sitemap_excludes_petrol_pages_without_verified_snapshot(): void
    {
        Cache::flush();

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertHeader('content-type', 'application/xml; charset=UTF-8');
        $response->assertDontSee($this->publicUrl(route('seo.petrol', ['city' => 'karachi'], false)), false);
        $response->assertDontSee($this->publicUrl(route('seo.electricity', ['disco' => 'lesco'], false)), false);
        $response->assertDontSee($this->publicUrl(route('seo.ration', ['size' => 4], false)), false);
    }

    public function test_sitemap_excludes_verified_petrol_urls_when_page_group_is_forced_noindex(): void
    {
        $snapshot = SeoPageSnapshot::query()->create([
            'page_type' => 'petrol',
            'page_key' => 'karachi',
            'title' => 'Petrol price in Karachi today',
            'value_1' => 321.17,
            'value_2' => 321.17,
            'value_3' => 0.00,
            'summary_text' => 'Official Petroleum Division petrol pricing places Motor Spirit (MS) at PKR 321.17 per litre for Pakistan, which is the same notified rate households in Karachi can use as today\'s planning benchmark.',
            'comparison_text' => 'Official notified petrol price for Karachi is unchanged from the previous Petroleum Division update.',
            'effective_date' => '2026-03-28',
            'source_label' => 'Government of Pakistan - Petroleum Division',
            'extra_json' => [
                'has_verified_data' => true,
                'is_indexable' => true,
            ],
        ]);

        $snapshot->forceFill([
            'updated_at' => Carbon::parse('2026-03-29 09:00:00', 'Asia/Karachi'),
        ])->save();

        Cache::flush();

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertDontSee($this->publicUrl(route('seo.petrol', ['city' => 'karachi'], false)), false);
        $response->assertDontSee($snapshot->fresh()->updated_at->toAtomString(), false);
    }

    public function test_sitemap_excludes_nationwide_backup_petrol_urls_when_page_group_is_forced_noindex(): void
    {
        $snapshot = SeoPageSnapshot::query()->create([
            'page_type' => 'petrol',
            'page_key' => 'karachi',
            'title' => 'Petrol price in Karachi today',
            'value_1' => 321.17,
            'value_2' => 321.17,
            'value_3' => 0.00,
            'summary_text' => 'Latest available PakWheels nationwide petroleum listing places petrol at PKR 321.17 per litre. Roznamcha is showing this temporary nationwide reference for Karachi because both the official Petroleum Division notice and the city-level PakFuel snapshot were unavailable during the latest refresh.',
            'comparison_text' => 'Official and city-level sources are still pending for Karachi, so this page is temporarily showing the latest nationwide petrol reference instead of an empty placeholder.',
            'effective_date' => '2026-03-29',
            'source_label' => 'PakWheels nationwide petroleum price fallback',
            'extra_json' => [
                'has_live_data' => true,
                'is_indexable' => true,
                'source_type' => 'backup-national',
                'source_url' => 'https://www.pakwheels.com/petroleum-prices-in-pakistan',
            ],
        ]);

        $snapshot->forceFill([
            'updated_at' => Carbon::parse('2026-03-29 11:30:00', 'Asia/Karachi'),
        ])->save();

        Cache::flush();

        $response = $this->get('/sitemap.xml');

        $response->assertOk();
        $response->assertDontSee($this->publicUrl(route('seo.petrol', ['city' => 'karachi'], false)), false);
        $response->assertDontSee($snapshot->fresh()->updated_at->toAtomString(), false);
    }

    public function test_refresh_command_generates_verified_petrol_snapshots_and_internal_estimators(): void
    {
        Http::fake([
            config('roznamcha_seo.petrol.official_listing_url') => Http::response($this->petrolListingHtml(), 200),
            'https://petroleum.gov.pk/NewsDetail/NDNhYTRmZDktMDMzYS00NzRlLWI4NmQtMzgyNzdjMGM1Njli' => Http::response($this->petrolDetailHtml(), 200),
        ]);

        $this->artisan('roznamcha:refresh-seo-snapshots --date=2026-03-29')
            ->assertExitCode(0);

        $this->assertDatabaseCount('seo_page_snapshots', 14);
        $this->assertDatabaseHas('seo_page_snapshots', [
            'page_type' => 'petrol',
            'page_key' => 'karachi',
            'source_label' => 'Government of Pakistan - Petroleum Division',
        ]);
        $this->assertDatabaseHas('seo_page_snapshots', [
            'page_type' => 'electricity',
            'page_key' => 'lesco',
        ]);
        $this->assertDatabaseHas('seo_page_snapshots', [
            'page_type' => 'ration',
            'page_key' => '4',
        ]);
    }

    private function petrolListingHtml(): string
    {
        return <<<'HTML'
<!DOCTYPE html>
<html>
<body>
    <table>
        <tr>
            <td>Prices of Petroleum Products from 28th March, 2026</td>
            <td>March 28, 2026</td>
            <td><a href="https://petroleum.gov.pk/NewsDetail/NDNhYTRmZDktMDMzYS00NzRlLWI4NmQtMzgyNzdjMGM1Njli">Download</a></td>
        </tr>
        <tr>
            <td>Prices of Petroleum Products from 1st March, 2026</td>
            <td>March 1, 2026</td>
            <td><a href="https://petroleum.gov.pk/NewsDetail/YmExMmNiODYtMTY5My00ZmVlLThlMzgtZjIwNzJkYTU4MmU1">Download</a></td>
        </tr>
    </table>
</body>
</html>
HTML;
    }

    private function publicUrl(string $path): string
    {
        return rtrim((string) config('roznamcha_seo.base_url'), '/').$path;
    }

    private function petrolDetailHtml(): string
    {
        return <<<'HTML'
<!DOCTYPE html>
<html>
<body>
    <h3><span id="ContentPlaceHolder1_lblHeading">Prices of Petroleum Products from 28th March, 2026</span></h3>
    <img id="ContentPlaceHolder1_ImgSlider" src="/SiteImage/NewsEvents/Petrol Prices wef 28.3.2026.jpeg" />
</body>
</html>
HTML;
    }
}
