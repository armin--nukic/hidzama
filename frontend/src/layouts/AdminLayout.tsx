import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { ThemeToggle } from '../components/ThemeToggle';
import { authStore } from '../lib/auth';

const links = [
  { to: '/admin', key: 'dashboard', adminOnly: true },
  { to: '/admin/appointments', key: 'appointments', adminOnly: true },
  { to: '/admin/services', key: 'services', adminOnly: false },
  { to: '/admin/posts', key: 'posts', adminOnly: false },
  { to: '/admin/testimonials', key: 'testimonials', adminOnly: true },
  { to: '/admin/contacts', key: 'contacts', adminOnly: true },
  { to: '/admin/users', key: 'users', adminOnly: true }
];

export function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const role = authStore.getRole();
  const visibleLinks = links.filter((link) => !link.adminOnly || role === 'ADMIN');

  return (
    <div className="min-h-screen bg-pearl text-ink">
      <aside className="border-b border-forest/10 bg-ink text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3">
          <div className="mr-4 flex items-center gap-3">
            <img src="/logo-shifa.svg" alt="Sifa Hidžama" className="h-10 w-10 rounded-full" />
            <div>
              <p className="font-bold leading-tight">Sifa Admin</p>
              <p className="text-xs text-white/55">{role ?? 'USER'}</p>
            </div>
          </div>
          {visibleLinks.map(({ to, key }) => (
            <NavLink
              end={to === '/admin'}
              key={to}
              to={to}
              className={({ isActive }) => `rounded-full px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-gold text-ink' : 'text-white/80 hover:bg-white/10'}`}
            >
              {t(`admin.${key}`)}
            </NavLink>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
            <button
              className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold transition hover:bg-white/15"
              onClick={() => {
                authStore.clear();
                navigate('/admin/login');
              }}
            >
              {t('admin.logout')}
            </button>
          </div>
        </div>
      </aside>
      <main className="mx-auto max-w-7xl px-4 py-8"><Outlet /></main>
    </div>
  );
}
