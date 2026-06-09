import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { HeartPulse, ShieldCheck, Sparkles, Star, Stethoscope } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api, type BlogPost, type Service, type Testimonial, localized } from '../lib/api';
import { Section } from '../components/Section';
import { Seo } from '../components/Seo';
import { HeroSlider } from '../components/HeroSlider';

const fallbackTestimonials = [
  {
    id: 'fallback-amina',
    name: 'Amina K.',
    quoteBs: 'Profesionalan pristup, čist prostor i mirna komunikacija. Od početka sam imala osjećaj sigurnosti.',
    quoteEn: 'Professional care, clean space and calm communication. I felt safe from the start.',
    image: '/client-amina.svg'
  },
  {
    id: 'fallback-adnan',
    name: 'Adnan M.',
    quoteBs: 'Nakon sportske hidžame osjetio sam lakši oporavak i manje napetosti u leđima.',
    quoteEn: 'After sports hijama I felt easier recovery and less tension in my back.',
    image: '/client-adnan.svg'
  },
  {
    id: 'fallback-lejla',
    name: 'Lejla H.',
    quoteBs: 'Termin je bio diskretan, uredan i objašnjen korak po korak. Rado preporučujem.',
    quoteEn: 'The appointment was discreet, tidy and explained step by step. I gladly recommend it.',
    image: '/client-lejla.svg'
  }
];

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
  const shownTestimonials = [...testimonials.map((item, index) => ({ ...item, image: fallbackTestimonials[index % fallbackTestimonials.length].image })), ...fallbackTestimonials].slice(0, 3);

  return (
    <>
      <Seo
        title="Šifa Hidžama Visoko"
        description="Šifa Hidžama u Bosni i Hercegovini, Porječani kod Visokog. Profesionalna hidžama, akupunktura, terapija čašama i online rezervacije."
      />
      <section className="bg-pearl">
        <div className="mx-auto max-w-7xl px-4 py-5 md:py-7">
          <HeroSlider />
          <div className="relative z-10 mx-auto -mt-8 grid max-w-5xl gap-3 px-3 sm:grid-cols-3">
            {[
              ['Prirodno', 'Blag pristup terapiji'],
              ['Sigurno', 'Sterilna oprema'],
              ['Provjereno', 'Od 2006']
            ].map(([title, text]) => (
              <div key={title} className="surface-card rounded-[8px] p-4 text-center">
                <p className="text-sm font-extrabold text-forest">{title}</p>
                <p className="mt-1 text-xs font-semibold text-ink/65">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Šifa Hidžama BiH</p>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">{t('home.benefits')}</h2>
          </div>
          <p className="max-w-2xl text-lg leading-8 text-ink/70">
            Tretmani se planiraju individualno, uz fokus na higijenu, smiren razgovor i realna očekivanja prije svakog termina.
          </p>
        </div>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div key={benefit.textBs} className="surface-card rounded-[8px] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/18">
                <benefit.icon className="h-7 w-7 text-gold" />
              </div>
              <p className="mt-5 text-lg font-extrabold">{i18n.language === 'en' ? benefit.textEn : benefit.textBs}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section muted>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-forest">Hidžama i akupunktura</p>
            <h2 className="mt-2 font-display text-4xl font-bold">{t('home.services')}</h2>
          </div>
          <Link className="focus-ring rounded-full bg-forest px-5 py-3 text-sm font-extrabold text-white" to="/services">{t('cta.details')}</Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {services.slice(0, 4).map((service) => (
            <article key={service.id} className="surface-card rounded-[8px] p-5">
              <Stethoscope className="h-6 w-6 text-gold" />
              <h3 className="mt-4 text-lg font-extrabold">{localized(service, 'title', i18n.language)}</h3>
              <p className="mt-3 text-sm leading-6 text-ink/70">{localized(service, 'summary', i18n.language)}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Iskustva klijenata</p>
            <h2 className="mt-2 font-display text-4xl font-bold">{t('home.testimonials')}</h2>
          </div>
          <div className="flex gap-1 text-gold">{Array.from({ length: 5 }).map((_, index) => <Star key={index} className="h-5 w-5 fill-current" />)}</div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {shownTestimonials.map((item) => (
            <blockquote key={item.id} className="surface-card rounded-[8px] p-5">
              <div className="flex items-center gap-4">
                <img src={item.image} alt="" className="h-16 w-16 rounded-full object-cover" />
                <div>
                  <p className="font-extrabold">{item.name}</p>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest">Klijent</p>
                </div>
              </div>
              <p className="mt-5 leading-7 text-ink/75">"{localized(item, 'quote', i18n.language)}"</p>
            </blockquote>
          ))}
        </div>
      </Section>

      <Section muted>
        <h2 className="font-display text-4xl font-bold">{t('home.latest')}</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {posts.slice(0, 2).map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="focus-ring surface-card rounded-[8px] p-6">
              <h3 className="text-xl font-extrabold">{localized(post, 'title', i18n.language)}</h3>
              <p className="mt-3 leading-7 text-ink/70">{localized(post, 'excerpt', i18n.language)}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
