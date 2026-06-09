import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'sifa_theme';

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const isDark = theme === 'dark';

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label={isDark ? 'Uključi dnevni način' : 'Uključi noćni način'}
      title={isDark ? 'Dnevni način' : 'Noćni način'}
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      className="focus-ring grid h-10 w-10 place-items-center rounded-full border border-forest/20 bg-white/85 text-ink shadow-sm transition hover:bg-sage"
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
