<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
    <channel>
        <title>Roznamcha Blog</title>
        <link>{{ $siteUrl }}/blog</link>
        <description><![CDATA[{{ $description }}]]></description>
        <language>en</language>
        <lastBuildDate>{{ now()->toRssString() }}</lastBuildDate>
        @foreach ($posts as $post)
            <item>
                <title><![CDATA[{{ $post->title }}]]></title>
                <link>{{ route('public.blog.show', ['slug' => $post->slug], true) }}</link>
                <guid isPermaLink="true">{{ route('public.blog.show', ['slug' => $post->slug], true) }}</guid>
                <pubDate>{{ optional($post->published_at ?? $post->updated_at)->toRssString() }}</pubDate>
                <description><![CDATA[{!! $post->excerpt ?? \Illuminate\Support\Str::limit(strip_tags($post->rendered_content), 220) !!}]]></description>
                <content:encoded><![CDATA[{!! $post->rendered_content !!}]]></content:encoded>
                @foreach ($post->categories as $category)
                    <category><![CDATA[{{ $category->name }}]]></category>
                @endforeach
            </item>
        @endforeach
    </channel>
</rss>
