import type { ReactNode } from 'react';

export function Section({ children, muted = false }: { children: ReactNode; muted?: boolean }) {
  return (
    <section className={muted ? 'bg-sage/45' : 'bg-pearl'}>
      <div className="mx-auto max-w-7xl px-4 py-14 md:py-20">{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="pattern border-b border-forest/10 bg-sage/45">
      <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <h1 className="max-w-3xl font-display text-4xl font-bold md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/75">{subtitle}</p>}
      </div>
    </div>
  );
}
