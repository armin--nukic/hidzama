import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { api, localized, type Service } from '../lib/api';
import { PageHeader, Section } from '../components/Section';
import { Seo } from '../components/Seo';

export function Services() {
  const { t, i18n } = useTranslation();
  const { data = [] } = useQuery({ queryKey: ['services'], queryFn: () => api<Service[]>('/services') });
  return (
    <>
      <Seo title={t('services.title')} description="Hidžama Sunnah, sportska, preventivna i ženska hidžama, akupunktura i cijene." />
      <PageHeader title={t('services.title')} />
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {data.map((service) => (
            <article key={service.id} className="rounded-[8px] border border-forest/10 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold">{localized(service, 'title', i18n.language)}</h2>
              <p className="mt-3 leading-7 text-ink/70">{localized(service, 'description', i18n.language)}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold">
                <span className="rounded-full bg-sage px-4 py-2">{t('services.duration')}: {service.durationMin} min</span>
                <span className="rounded-full bg-gold/25 px-4 py-2">{t('services.price')}: {service.priceBam} KM</span>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
