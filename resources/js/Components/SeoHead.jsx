import React from 'react';
import { Head } from '@inertiajs/react';
import { SITE_URL, DEFAULT_OG_IMAGE } from '../lib/seo';

export default function SeoHead({
    title,
    description,
    url = SITE_URL,
    canonical = SITE_URL,
    robots = 'index,follow',
    type = 'website',
    keywords = [],
    image = DEFAULT_OG_IMAGE,
    twitterCard = 'summary_large_image',
    author = 'Mohsin',
    jsonLd = null,
}) {
    const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : keywords;

    return (
        <Head title={title}>
            <meta name="description" content={description} head-key="description" />
            <meta name="robots" content={robots} head-key="robots" />
            {keywordContent && <meta name="keywords" content={keywordContent} head-key="keywords" />}
            <link rel="canonical" href={canonical} head-key="canonical" />
            {author && <meta name="author" content={author} head-key="author" />}

            <meta property="og:title" content={title} head-key="og:title" />
            <meta property="og:description" content={description} head-key="og:description" />
            <meta property="og:type" content={type} head-key="og:type" />
            <meta property="og:url" content={url} head-key="og:url" />
            <meta property="og:image" content={image} head-key="og:image" />
            <meta property="og:site_name" content="Roznamcha" head-key="og:site_name" />

            <meta name="twitter:card" content={twitterCard} head-key="twitter:card" />
            <meta name="twitter:title" content={title} head-key="twitter:title" />
            <meta name="twitter:description" content={description} head-key="twitter:description" />
            <meta name="twitter:image" content={image} head-key="twitter:image" />

            {jsonLd && (
                <script
                    head-key="page-jsonld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
        </Head>
    );
}
