import { Link, NavLink, Outlet } from 'react-router-dom';
import { CalendarCheck, MapPin, Menu, Phone } from 'lucide-react';
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
      className={({ isActive }) => `focus-ring rounded-full px-3 py-2 text-sm font-semibold ${isActive ? 'bg-forest text-white' : 'text-ink hover:bg-sage'}`}
    >
      {t(`nav.${key}`)}
    </NavLink>
  ));

  return (
    <div className="min-h-screen bg-pearl text-ink">
      <header className="sticky top-0 z-40 border-b border-forest/10 bg-pearl/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="focus-ring flex items-center gap-3 rounded-full">
            <img src="/logo-shifa.svg" alt="Sifa Hidžama" className="h-11 w-11 rounded-full" />
            <span className="leading-tight">
              <span className="block text-lg font-bold">Sifa Hidžama</span>
              <span className="block text-xs font-semibold text-forest">Porječani, Visoko</span>
            </span>
          </Link>
          <div className="hidden items-center gap-1 lg:flex">{links}</div>
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            <LanguageSwitcher />
            <a className="focus-ring inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-bold text-ink" href="tel:+38761497647">
              <Phone className="h-4 w-4" /> 061 497 647
            </a>
          </div>
          <button className="focus-ring rounded-full p-2 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label="Open menu">
            <Menu className="h-6 w-6" />
          </button>
        </nav>
        {open && <div className="mx-auto grid max-w-7xl gap-2 px-4 pb-4 lg:hidden">{links}<div className="flex flex-wrap gap-2"><ThemeToggle /><LanguageSwitcher /></div></div>}
      </header>
      <main>
        <Outlet />
      </main>
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest/10 bg-white/95 p-3 shadow-soft backdrop-blur md:hidden">
        <div className="grid grid-cols-2 gap-2">
          <a className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-bold text-ink" href="tel:+38761497647">
            <Phone className="h-4 w-4" /> 061 497 647
          </a>
          <Link className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-forest px-4 py-3 text-sm font-bold text-white" to="/booking">
            <CalendarCheck className="h-4 w-4" /> {t('cta.book')}
          </Link>
        </div>
      </div>
      <footer className="border-t border-forest/10 bg-ink pb-20 text-white md:pb-0">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold">Sifa Hidžama</p>
            <p className="mt-3 flex gap-2 text-sm text-white/75"><MapPin className="h-4 w-4 shrink-0" /> Porječani, Visoko, Bosna i Hercegovina</p>
          </div>
          <div>
            <p className="font-semibold">{t('contact.hours')}</p>
            <p className="mt-3 text-sm text-white/75">Pon-Sub 09:00-18:00</p>
          </div>
          <div>
            <p className="font-semibold">Kontakt</p>
            <p className="mt-3 text-sm text-white/75">Amir Uzunović<br />info@sifahidzama.ba<br />061 497 647</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
