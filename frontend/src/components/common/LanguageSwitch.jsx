import { useLanguage } from '../../hooks/useLanguage';

export default function LanguageSwitch() {
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1 bg-cream/10 rounded-lg p-0.5">
      <button
        onClick={() => setLang('fr')}
        className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer border-0 ${
          lang === 'fr' ? 'bg-cream text-navy' : 'text-cream/80 hover:text-cream bg-transparent'
        }`}
      >
        FR
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-2 py-1 rounded text-xs font-medium transition cursor-pointer border-0 ${
          lang === 'en' ? 'bg-cream text-navy' : 'text-cream/80 hover:text-cream bg-transparent'
        }`}
      >
        EN
      </button>
    </div>
  );
}
