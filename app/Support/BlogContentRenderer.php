<?php

namespace App\Support;

use Illuminate\Support\Str;

class BlogContentRenderer
{
    public static function render(string $content, string $format = 'markdown'): string
    {
        $content = trim($content);

        if ($content === '') {
            return '';
        }

        $normalized = static::normalizeLineEndings($content);

        if ($format === 'html') {
            return static::sanitizeHtml($normalized);
        }

        if (static::looksLikePlainText($normalized)) {
            return static::plainTextToHtml($normalized);
        }

        $html = Str::markdown($normalized, [
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
        ]);

        return static::sanitizeHtml($html);
    }

    protected static function sanitizeHtml(string $html): string
    {
        if ($html === '') {
            return '';
        }

        $allowedTags = [
            'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'pre', 'code', 'a', 'img', 'article', 'section', 'header', 'footer', 'main', 'aside', 'nav',
            'div', 'span', 'figure', 'figcaption', 'table', 'tbody', 'thead', 'tfoot', 'tr', 'td', 'th', 'hr',
        ];

        $allowedAttributes = [
            'a' => ['href', 'title'],
            'img' => ['src', 'alt', 'title'],
        ];

        $document = new \DOMDocument('1.0', 'UTF-8');
        libxml_use_internal_errors(true);

        try {
            $loaded = $document->loadHTML(
                '<?xml encoding="utf-8"?><body>'.$html.'</body>',
                LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
            );
        } catch (\Throwable $exception) {
            libxml_clear_errors();

            return e($html);
        }

        if (! $loaded) {
            libxml_clear_errors();

            return e($html);
        }

        $root = $document->getElementsByTagName('body')->item(0);
        if (! $root) {
            libxml_clear_errors();

            return e($html);
        }

        $output = '';
        foreach (iterator_to_array($root->childNodes) as $child) {
            static::sanitizeNode($child, $allowedTags, $allowedAttributes);
            $output .= $document->saveHTML($child);
        }

        libxml_clear_errors();

        return $output;
    }

    protected static function sanitizeNode(\DOMNode $node, array $allowedTags, array $allowedAttributes): void
    {
        if ($node->nodeType === XML_ELEMENT_NODE) {
            $tag = strtolower($node->nodeName);
            if (! in_array($tag, $allowedTags, true)) {
                static::unwrapNode($node);

                return;
            }

            if ($node->hasAttributes()) {
                $attributes = iterator_to_array($node->attributes);
                foreach ($attributes as $attribute) {
                    $attrName = strtolower($attribute->nodeName);
                    $allowed = $allowedAttributes[$tag] ?? [];

                    if (! in_array($attrName, $allowed, true)) {
                        $node->removeAttributeNode($attribute);

                        continue;
                    }

                    if (in_array($attrName, ['href', 'src'], true) && ! static::isSafeUrl($attribute->nodeValue)) {
                        $node->removeAttribute($attrName);
                    }
                }
            }
        }

        if ($node->hasChildNodes()) {
            foreach (iterator_to_array($node->childNodes) as $child) {
                static::sanitizeNode($child, $allowedTags, $allowedAttributes);
            }
        }
    }

    protected static function unwrapNode(\DOMNode $node): void
    {
        $parent = $node->parentNode;

        if (! $parent) {
            return;
        }

        while ($node->firstChild) {
            $parent->insertBefore($node->firstChild, $node);
        }

        $parent->removeChild($node);
    }

    protected static function isSafeUrl(?string $url): bool
    {
        if (! $url) {
            return false;
        }

        $url = trim($url);

        if ($url === '') {
            return false;
        }

        if (str_starts_with($url, '/')) {
            return true;
        }

        return (bool) preg_match('#^https?://#i', $url);
    }

    protected static function normalizeLineEndings(string $value): string
    {
        $value = str_replace(["\r\n", "\r"], "\n", $value);

        // Handle U+2028 line separators common in pasted content
        $value = str_replace("\u{2028}", "\n", $value);

        return preg_replace("/\n{3,}/", "\n\n", $value);
    }

    protected static function looksLikePlainText(string $value): bool
    {
        return ! preg_match('/(#|\*|`|\[|\]|<|>|\d+\.\s|-{2,}|^\s*>)/m', $value);
    }

    protected static function plainTextToHtml(string $value): string
    {
        $paragraphs = preg_split('/\n{2,}/', $value) ?: [];

        $segments = array_map(function (string $paragraph) {
            $paragraph = trim($paragraph);
            if ($paragraph === '') {
                return '';
            }

            $escaped = e($paragraph);
            $escaped = preg_replace('/\n/', '<br>', $escaped);

            return "<p>{$escaped}</p>";
        }, $paragraphs);

        return implode("\n", array_filter($segments));
    }
}
