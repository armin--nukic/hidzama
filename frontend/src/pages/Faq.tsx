import { useTranslation } from 'react-i18next';
import { PageHeader, Section } from '../components/Section';
import { Seo } from '../components/Seo';

export function Faq() {
  const { t, i18n } = useTranslation();
  const items = i18n.language === 'en'
    ? [['Is Hijama painful?', 'Most clients describe short discomfort, not strong pain.'], ['How long does it take?', 'Most treatments last 45 to 60 minutes.'], ['Do you use sterile equipment?', 'Yes, disposable sterile cups and strict hygiene protocols are used.']]
    : [['Da li je hidžama bolna?', 'Većina klijenata osjeti kratku nelagodu, ne jaku bol.'], ['Koliko traje tretman?', 'Većina tretmana traje 45 do 60 minuta.'], ['Da li koristite sterilnu opremu?', 'Da, koriste se sterilne jednokratne čaše i strogi higijenski protokoli.']];
  return (
    <>
      <Seo title={t('faq.title')} description="Odgovori na česta pitanja o hidžami." />
      <PageHeader title={t('faq.title')} />
      <Section>
        <div className="grid gap-4">
          {items.map(([q, a]) => <details key={q} className="rounded-[8px] bg-white p-5 shadow-sm"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 leading-7 text-ink/70">{a}</p></details>)}
        </div>
      </Section>
    </>
  );
}
