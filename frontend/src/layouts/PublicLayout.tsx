import { Link, NavLink, Outlet } from 'react-router-dom';
import { CalendarCheck, Clock3, Mail, MapPin, Menu, Phone, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';

const nav = [
  ['/', 'home'],
  ['/about', 'about'],
  ['/services', 'services'],
  ['/booking', 'booking'],
  ['/blog', 'blog'],
  ['/faq', 'faq'],
  ['/contact', 'contact']
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const links = nav.map(([to, key]) => (
    <NavLink
      key={to}
      to={to}
      onClick={() => setOpen(false)}
      className={({ isActive }) => `focus-ring rounded-full px-3.5 py-2 text-sm font-bold transition ${isActive ? 'bg-forest text-white shadow-sm' : 'text-ink/78 hover:bg-sage hover:text-ink'}`}
    >
      {t(`nav.${key}`)}
    </NavLink>
  ));

  return (
    <div className="min-h-screen bg-pearl text-ink">
      <header className="sticky top-0 z-40 border-b border-forest/10 glass-nav backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="focus-ring flex items-center gap-3 rounded-full">
            <span className="brand-mark grid h-12 w-12 place-items-center rounded-full shadow-glow">
              <img src="/logo-shifa.svg" alt="Šifa Hidžama" className="h-10 w-10 rounded-full bg-white" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold">Šifa Hidžama</span>
            </span>
          </Link>
          <div className="hidden items-center rounded-full border border-forest/10 bg-white/55 p-1 shadow-sm lg:flex">{links}</div>
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <LanguageSwitcher />
            <a className="focus-ring inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:brightness-105" href="tel:+38761497647">
              <Phone className="h-4 w-4" /> 061 497 647
            </a>
          </div>
          <button className="focus-ring grid h-11 w-11 place-items-center rounded-full bg-white/70 text-ink shadow-sm lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {open && (
          <div className="mx-auto grid max-w-7xl gap-3 px-4 pb-4 lg:hidden">
            <div className="surface-card grid gap-1 rounded-[8px] p-2">{links}</div>
            <div className="flex flex-wrap items-center gap-2"><ThemeToggle /><LanguageSwitcher /></div>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/10 bg-white/95 p-3 shadow-soft backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-extrabold text-ink" href="tel:+38761497647">
            <Phone className="h-4 w-4" /> 061 497 647
          </a>
          <Link className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-extrabold text-white" to="/booking">
            <CalendarCheck className="h-4 w-4" /> {t('cta.book')}
          </Link>
        </div>
      </div>
      <footer className="footer-dark border-t border-white/10 pb-20 text-white md:pb-0">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <img src="/logo-shifa.svg" alt="Šifa Hidžama" className="h-14 w-14 rounded-full bg-white" />
              <div>
                <p className="font-display text-2xl font-bold">Šifa Hidžama</p>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">Bosna i Hercegovina</p>
              </div>
            </div>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/72">
              Profesionalna hidžama, akupunktura i terapija čašama u Porječanima kod Visokog. Diskretan pristup, sterilna oprema i online rezervacije.
            </p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.12em] text-white/70">
              <span className="rounded-full border border-white/15 px-3 py-1.5"><ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-gold" /> Od 2006</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">Sunnetska praksa</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">Porječani, Visoko</span>
            </div>
          </div>
          <div>
            <p className="font-bold">{t('contact.hours')}</p>
            <p className="mt-4 flex gap-2 text-sm text-white/75"><Clock3 className="mt-0.5 h-4 w-4 text-gold" /> Pon-Sub 09:00-18:00</p>
            <Link className="mt-5 inline-flex rounded-full bg-gold px-5 py-3 text-sm font-extrabold text-ink" to="/booking">{t('cta.book')}</Link>
          </div>
          <div>
            <p className="font-bold">Kontakt</p>
            <div className="mt-4 grid gap-3 text-sm text-white/75">
              <p>Amir Uzunović</p>
              <p className="flex gap-2"><MapPin className="mt-0.5 h-4 w-4 text-gold" /> Porječani, Visoko</p>
              <a className="flex gap-2 font-bold text-white" href="tel:+38761497647"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 061 497 647</a>
              <a className="flex gap-2 font-bold text-white" href="mailto:info@sifahidzama.ba"><Mail className="mt-0.5 h-4 w-4 text-gold" /> info@sifahidzama.ba</a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs font-semibold text-white/60">
            <p>© 2026 Šifa Hidžama. Sva prava zadržana.</p>
            <p>sifahidzama.ba</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
