import { useLanguage } from '../lib/language-context';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded font-bold text-sm transition-colors ${
          language === 'en'
            ? 'bg-kevin-orange text-black'
            : 'bg-black bg-opacity-50 text-white hover:bg-kevin-orange hover:text-black'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1 rounded font-bold text-sm transition-colors ${
          language === 'zh'
            ? 'bg-kevin-orange text-black'
            : 'bg-black bg-opacity-50 text-white hover:bg-kevin-orange hover:text-black'
        }`}
      >
        中文
      </button>
    </div>
  );
}