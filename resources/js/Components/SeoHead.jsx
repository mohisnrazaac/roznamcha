import React from 'react';
import { Head } from '@inertiajs/react';
import { SITE_URL, DEFAULT_OG_IMAGE } from '../lib/seo';

export default function SeoHead({
    title,
    description,
    url = SITE_URL,
    canonical = SITE_URL,
    type = 'website',
    keywords = [],
    image = DEFAULT_OG_IMAGE,
    twitterCard = 'summary_large_image',
    jsonLd = null,
}) {
    const keywordContent = Array.isArray(keywords) ? keywords.join(', ') : keywords;

    return (
        <Head title={title}>
            <meta name="description" content={description} head-key="description" />
            {keywordContent && <meta name="keywords" content={keywordContent} />}
            <link rel="canonical" href={canonical} />

            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Roznamcha" />

            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
        </Head>
    );
}
