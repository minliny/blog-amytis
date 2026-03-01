import { getPostBySlug, getAllPosts, getRelatedPosts, getSeriesPosts, getSeriesData, getAdjacentPosts, buildSlugRegistry, getBacklinks, PostData } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import PostLayout from '@/layouts/PostLayout';
import SimpleLayout from '@/layouts/SimpleLayout';
import { Metadata } from 'next';
import { siteConfig } from '../../../../site.config';
import { resolveLocale } from '@/lib/i18n';
import { getPostsBasePath, getSeriesCustomPaths } from '@/lib/urls';

function safeDecodeParam(param: string): string {
  try {
    return decodeURIComponent(param);
  } catch {
    return param;
  }
}

function resolvePostFromParam(rawSlug: string) {
  const decoded = safeDecodeParam(rawSlug);
  return (
    getPostBySlug(decoded) ||
    getPostBySlug(rawSlug) ||
    getPostBySlug(decoded.normalize('NFC')) ||
    getPostBySlug(decoded.normalize('NFD'))
  );
}

export async function generateStaticParams() {
  const params: { prefix: string; slug: string }[] = [];

  // Custom posts basePath — all posts served at /[basePath]/[slug]
  const basePath = getPostsBasePath();
  if (basePath !== 'posts') {
    getAllPosts().forEach(post => params.push({ prefix: basePath, slug: post.slug }));
  }

  // Series custom paths — only posts belonging to that series
  for (const [seriesSlug, customPath] of Object.entries(getSeriesCustomPaths())) {
    getSeriesPosts(seriesSlug).forEach(post =>
      params.push({ prefix: customPath, slug: post.slug })
    );
  }

  return params;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ prefix: string; slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const post = resolvePostFromParam(rawSlug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  const ogImage =
    post.coverImage && !post.coverImage.startsWith('text:') && !post.coverImage.startsWith('./')
      ? post.coverImage
      : siteConfig.ogImage;

  return {
    title: `${post.title} | ${resolveLocale(siteConfig.title)}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: post.authors,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      siteName: resolveLocale(siteConfig.title),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  };
}

export default async function PrefixPostPage({
  params,
}: {
  params: Promise<{ prefix: string; slug: string }>;
}) {
  const { prefix, slug: rawSlug } = await params;
  const slug = safeDecodeParam(rawSlug);

  // Validate the prefix is a known custom path
  const basePath = getPostsBasePath();
  const customPaths = getSeriesCustomPaths();
  const isValidBasePath = prefix === basePath && basePath !== 'posts';
  const matchedSeriesSlug = Object.entries(customPaths).find(([, path]) => path === prefix)?.[0];

  if (!isValidBasePath && !matchedSeriesSlug) {
    notFound();
  }

  const post = resolvePostFromParam(rawSlug);
  if (!post) {
    notFound();
  }

  const layout = post.layout || 'post';

  if (layout === 'simple') {
    return <SimpleLayout post={post} />;
  }

  const relatedPosts = getRelatedPosts(slug);
  const { prev, next } = getAdjacentPosts(slug);
  const slugRegistry = buildSlugRegistry();
  const backlinks = getBacklinks(slug);
  let seriesPosts: PostData[] = [];
  let seriesTitle: string | undefined;

  if (post.series) {
    seriesPosts = getSeriesPosts(post.series);
    const seriesData = getSeriesData(post.series);
    seriesTitle = seriesData?.title;
  }

  return (
    <PostLayout
      post={post}
      relatedPosts={relatedPosts}
      seriesPosts={seriesPosts}
      seriesTitle={seriesTitle}
      prevPost={prev}
      nextPost={next}
      backlinks={backlinks}
      slugRegistry={slugRegistry}
    />
  );
}
