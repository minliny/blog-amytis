'use client';

import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { resolveLocaleValue } from '@/lib/i18n';

type LocaleValue = string | Record<string, string>;

interface HeroProps {
  tagline: LocaleValue;
  title: LocaleValue;
  subtitle: LocaleValue;
  postCount?: number;
  seriesCount?: number;
  bookCount?: number;
  flowCount?: number;
}

interface NavChipProps {
  href: string;
  count: number;
  label: string;
}

function NavChip({ href, count, label }: NavChipProps) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-muted/20 text-xs font-mono text-muted hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all duration-200 no-underline"
    >
      <span className="font-semibold text-heading group-hover:text-accent transition-colors duration-200">{count}</span>
      <span>{label}</span>
      <svg
        className="w-3 h-3 -translate-x-0.5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-200"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

export default function Hero({ tagline, title, subtitle, postCount, seriesCount, bookCount, flowCount }: HeroProps) {
  const { language } = useLanguage();
  const resolvedTagline = resolveLocaleValue(tagline, language);
  const resolvedTitle = resolveLocaleValue(title, language);
  const resolvedSubtitle = resolveLocaleValue(subtitle, language);

  const chips = [
    flowCount   ? { href: '#recent-flows',    count: flowCount,   label: 'flows'  } : null,
    postCount   ? { href: '#featured-posts',  count: postCount,   label: 'posts'  } : null,
    seriesCount ? { href: '#featured-series', count: seriesCount, label: 'series' } : null,
    bookCount   ? { href: '#featured-books',  count: bookCount,   label: 'books'  } : null,
  ].filter((c): c is NavChipProps => c !== null);

  return (
    <header className="relative py-12 md:py-20 flex flex-col items-center justify-center text-center max-w-6xl mx-auto min-h-[40vh] px-6">
      <div className="mb-8 flex items-center justify-center animate-fade-in">
        <span className="h-px w-12 bg-accent/30 mr-4"></span>
        <span className="text-xs font-sans font-bold uppercase tracking-[0.3em] text-accent/80">{resolvedTagline}</span>
        <span className="h-px w-12 bg-accent/30 ml-4"></span>
      </div>

      <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-heading leading-[1.1] tracking-tight mb-6 text-balance animate-slide-up">
        {resolvedTitle}
      </h1>

      <p className="text-muted font-sans text-sm md:text-base max-w-xl mx-auto leading-relaxed opacity-80 animate-slide-up animation-delay-200">
        {resolvedSubtitle}
      </p>

      {chips.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-3 animate-slide-up animation-delay-200">
          {chips.map(chip => (
            <NavChip key={chip.href} {...chip} />
          ))}
        </div>
      )}
    </header>
  );
}
