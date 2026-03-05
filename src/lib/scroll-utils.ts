import type React from 'react';

export function scrollToHeading(e: React.MouseEvent<HTMLAnchorElement>, id: string): void {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: elementPosition - 80, behavior: 'smooth' });
    history.pushState(null, '', `#${id}`);
  }
}
