import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const slides = [
  {
    image: '/hijama-hero.jpg',
    titleBs: 'Da li je vrijeme za hidžamu?',
    titleEn: 'Is it time for Hijama?',
    textBs: 'Prirodno, sigurno i provjereno u skladu sa sunnetskom praksom.',
    textEn: 'Natural, safe and trusted care aligned with Sunnah practice.'
  },
  {
    image: '/slide-brand-logo.svg',
    titleBs: 'Šifa Hidžama od 2006',
    titleEn: 'Sifa Hijama since 2006',
    textBs: 'Prepoznatljiv znak povjerenja, higijene i profesionalnog pristupa.',
    textEn: 'A recognizable mark of trust, hygiene and professional care.'
  },
  {
    image: '/slide-care.svg',
    titleBs: 'Mirno iskustvo od dolaska do tretmana',
    titleEn: 'A calm experience from arrival to therapy',
    textBs: 'Diskretan prostor, individualna procjena i sterilna oprema.',
    textEn: 'A discreet space, individual assessment and sterile equipment.'
  },
  {
    image: '/slide-booking.svg',
    titleBs: 'Rezervišite termin online',
    titleEn: 'Book your appointment online',
    textBs: 'Odaberite uslugu, datum i slobodan termin bez pozivanja.',
    textEn: 'Choose a service, date and available time without calling.'
  },
  {
    image: '/slide-acupuncture.svg',
    titleBs: 'Akupunktura u mirnom ambijentu',
    titleEn: 'Acupuncture in a calm setting',
    textBs: 'Precizan tretman za opuštanje, balans i podršku oporavku.',
    textEn: 'Precise therapy for relaxation, balance and recovery support.'
  },
  {
    image: '/slide-services-logo.svg',
    titleBs: 'Hidžama, akupunktura i oporavak',
    titleEn: 'Hijama, acupuncture and recovery',
    textBs: 'Sve usluge možete pregledati i rezervisati direktno na stranici.',
    textEn: 'Browse and book services directly through the website.'
  },
  {
    image: '/slide-relax.svg',
    titleBs: 'Briga koja počinje razgovorom',
    titleEn: 'Care that starts with listening',
    textBs: 'Svaki tretman se planira prema Vašem stanju i potrebama.',
    textEn: 'Every treatment is planned around your condition and needs.'
  }
];

export function HeroSlider() {
  const { i18n, t } = useTranslation();
  const [active, setActive] = useState(0);
  const language = i18n.language === 'en' ? 'En' : 'Bs';

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, []);

  const current = slides[active];
  const move = (direction: number) => setActive((value) => (value + direction + slides.length) % slides.length);

  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[8px] bg-ink shadow-glow md:min-h-[650px]">
      {slides.map((slide, index) => (
        <img
          key={slide.image}
          src={slide.image}
          alt=""
          className={`hero-slide absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${index === active ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/48 to-ink/5 md:bg-gradient-to-r md:from-ink/92 md:via-ink/45 md:to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white md:inset-y-0 md:left-0 md:right-auto md:flex md:w-[58%] md:flex-col md:justify-end md:p-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-gold">Šifa Hidžama • Porječani, Visoko</p>
        <h2 className="mt-4 font-display text-5xl font-bold leading-[1.02] md:text-7xl">{current[`title${language}` as const]}</h2>
        <p className="mt-5 max-w-xl text-base font-medium leading-7 text-white/82 md:text-lg">{current[`text${language}` as const]}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link className="focus-ring rounded-full bg-gold px-5 py-3 font-extrabold text-ink" to="/booking">{t('cta.book')}</Link>
          <a className="focus-ring rounded-full border border-white/40 bg-white/10 px-5 py-3 font-extrabold text-white backdrop-blur" href="tel:+38761497647">061 497 647</a>
        </div>
      </div>
      <div className="absolute right-4 top-4 flex gap-2">
        <button onClick={() => move(-1)} className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white/85 text-ink shadow-sm" aria-label="Previous slide"><ChevronLeft className="h-5 w-5" /></button>
        <button onClick={() => move(1)} className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white/85 text-ink shadow-sm" aria-label="Next slide"><ChevronRight className="h-5 w-5" /></button>
      </div>
      <div className="absolute bottom-4 right-4 flex gap-2">
        {slides.map((slide, index) => (
          <button key={slide.image} onClick={() => setActive(index)} aria-label={`Go to slide ${index + 1}`} className={`h-2.5 rounded-full transition-all ${active === index ? 'w-9 bg-gold' : 'w-2.5 bg-white/70'}`} />
        ))}
      </div>
    </div>
  );
}
