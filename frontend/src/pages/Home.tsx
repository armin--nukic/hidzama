import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, type BlogPost, type Service, type Testimonial, localized } from '../lib/api';
import { Section } from '../components/Section';
import { Seo } from '../components/Seo';
import { HeroSlider } from '../components/HeroSlider';

export function Home() {
  const { t, i18n } = useTranslation();
  const { data: services = [] } = useQuery({ queryKey: ['services'], queryFn: () => api<Service[]>('/services') });
  const { data: posts = [] } = useQuery({ queryKey: ['blog'], queryFn: () => api<BlogPost[]>('/blog') });
  const { data: testimonials = [] } = useQuery({ queryKey: ['testimonials'], queryFn: () => api<Testimonial[]>('/testimonials') });
  const benefits = [
    { icon: ShieldCheck, textBs: 'Sterilan i kontrolisan tretman', textEn: 'Sterile and controlled therapy' },
    { icon: HeartPulse, textBs: 'Individualna procjena stanja', textEn: 'Individual assessment' },
    { icon: Sparkles, textBs: 'Smiren ambijent i diskrecija', textEn: 'Calm setting and discretion' }
  ];

  return (
    <>
      <Seo title="Početna" description="Sifa Hidžama u Porječanima, Visoko. Hidžama, akupunktura i terapija čašama. Telefon 061 497 647." />
      <section className="bg-pearl">
        <div className="mx-auto max-w-7xl px-4 py-4 md:py-6">
          <HeroSlider />
          <div className="-mt-8 relative z-10 mx-auto grid max-w-5xl gap-3 px-3 sm:grid-cols-3">
            <div className="rounded-[8px] bg-white p-4 text-center shadow-soft"><p className="text-sm font-bold text-forest">Prirodno</p><p className="mt-1 text-xs text-ink/65">Blag pristup terapiji</p></div>
            <div className="rounded-[8px] bg-white p-4 text-center shadow-soft"><p className="text-sm font-bold text-forest">Sigurno</p><p className="mt-1 text-xs text-ink/65">Sterilna oprema</p></div>
            <div className="rounded-[8px] bg-white p-4 text-center shadow-soft"><p className="text-sm font-bold text-forest">Provjereno</p><p className="mt-1 text-xs text-ink/65">Od 2006</p></div>
          </div>
        </div>
      </section>

      <Section>
        <h2 className="text-3xl font-bold">{t('home.benefits')}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => <div key={benefit.textBs} className="rounded-[8px] border border-forest/10 bg-white p-6 shadow-sm"><benefit.icon className="h-8 w-8 text-gold" /><p className="mt-4 font-semibold">{i18n.language === 'en' ? benefit.textEn : benefit.textBs}</p></div>)}
        </div>
      </Section>

      <Section muted>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">{t('home.services')}</h2>
          <Link className="font-bold text-forest" to="/services">{t('cta.details')}</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {services.slice(0, 4).map((service) => <article key={service.id} className="rounded-[8px] bg-white p-5 shadow-sm"><h3 className="font-bold">{localized(service, 'title', i18n.language)}</h3><p className="mt-3 text-sm leading-6 text-ink/70">{localized(service, 'summary', i18n.language)}</p></article>)}
        </div>
      </Section>

      <Section>
        <h2 className="text-3xl font-bold">{t('home.testimonials')}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => <blockquote key={item.id} className="rounded-[8px] border border-forest/10 bg-white p-6"><p className="leading-7 text-ink/75">"{localized(item, 'quote', i18n.language)}"</p><footer className="mt-4 font-bold">{item.name}</footer></blockquote>)}
        </div>
      </Section>

      <Section muted>
        <h2 className="text-3xl font-bold">{t('home.latest')}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.slice(0, 2).map((post) => <Link key={post.id} to={`/blog/${post.slug}`} className="focus-ring rounded-[8px] bg-white p-6 shadow-sm"><h3 className="text-xl font-bold">{localized(post, 'title', i18n.language)}</h3><p className="mt-3 text-ink/70">{localized(post, 'excerpt', i18n.language)}</p></Link>)}
        </div>
      </Section>
    </>
  );
}
