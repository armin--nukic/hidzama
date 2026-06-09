import { useTranslation } from 'react-i18next';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const setLanguage = (lng: 'bs' | 'en') => {
    localStorage.setItem('sifa_lang', lng);
    void i18n.changeLanguage(lng);
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-forest/20 bg-white/85 p-1 shadow-sm" aria-label="Language selector">
      {(['bs', 'en'] as const).map((lng) => (
        <button
          key={lng}
          onClick={() => setLanguage(lng)}
          className={`focus-ring inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${i18n.language === lng ? 'bg-forest text-white' : 'text-ink hover:bg-sage'}`}
          aria-label={lng === 'bs' ? 'Bosanski' : 'English'}
        >
          <span className={`flag-${lng}`} aria-hidden="true" />
          <span>{lng === 'bs' ? 'BS' : 'US'}</span>
        </button>
      ))}
    </div>
  );
}
