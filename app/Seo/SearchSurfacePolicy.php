<?php

namespace App\Seo;

class SearchSurfacePolicy
{
    public function robotsForTemplate(string $slug): string
    {
        return $this->isTemplateNoindexed($slug) ? 'noindex,follow' : 'index,follow';
    }

    public function isTemplateNoindexed(string $slug): bool
    {
        return in_array($slug, $this->noindexTemplateSlugs(), true);
    }

    public function isProgrammaticPageTypeNoindexed(string $pageType): bool
    {
        return in_array($pageType, $this->noindexPageTypes(), true);
    }

    public function noindexTemplateSlugs(): array
    {
        return array_values(array_filter(
            config('roznamcha_seo.search_surface.noindex_template_slugs', []),
            'is_string'
        ));
    }

    public function noindexPageTypes(): array
    {
        return array_values(array_filter(
            config('roznamcha_seo.search_surface.noindex_page_types', []),
            'is_string'
        ));
    }
}
