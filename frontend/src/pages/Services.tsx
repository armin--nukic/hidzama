import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Clock3, Coins, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, localized, type Service } from '../lib/api';
import { PageHeader, Section } from '../components/Section';
import { Seo } from '../components/Seo';

export function Services() {
  const { t, i18n } = useTranslation();
  const { data = [] } = useQuery({ queryKey: ['services'], queryFn: () => api<Service[]>('/services') });

  return (
    <>
      <Seo title={t('services.title')} description="Hidžama Sunnah, sportska, preventivna i ženska hidžama, akupunktura i cijene u Šifa Hidžama Visoko." />
      <PageHeader title={t('services.title')} subtitle="Pregled usluga, trajanja i cijena. Svaki tretman se prilagođava stanju i potrebama klijenta." />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((service, index) => (
            <article key={service.id} className="surface-card group relative overflow-hidden rounded-[8px] p-6">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-gold/12 transition group-hover:bg-gold/20" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-forest text-white">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-gold">Usluga {index + 1}</p>
                <h2 className="mt-2 font-display text-3xl font-bold">{localized(service, 'title', i18n.language)}</h2>
                <p className="mt-4 leading-7 text-ink/72">{localized(service, 'description', i18n.language)}</p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm font-extrabold">
                  <span className="inline-flex items-center gap-2 rounded-full bg-sage px-4 py-2"><Clock3 className="h-4 w-4 text-forest" /> {t('services.duration')}: {service.durationMin} min</span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-gold/25 px-4 py-2"><Coins className="h-4 w-4 text-gold" /> {t('services.price')}: {service.priceBam} KM</span>
                </div>
                <Link className="mt-6 inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-extrabold text-white" to="/booking">
                  {t('cta.book')} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
