import { useLanguage } from '../lib/language-context';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (newLanguage: 'en' | 'zh') => {
    console.log('Language change requested:', newLanguage);
    setLanguage(newLanguage);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1 rounded font-bold text-sm transition-colors border ${
          language === 'en'
            ? 'bg-kevin-orange text-black border-kevin-orange'
            : 'bg-black bg-opacity-50 text-white border-gray-600 hover:bg-kevin-orange hover:text-black hover:border-kevin-orange'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleLanguageChange('zh')}
        className={`px-3 py-1 rounded font-bold text-sm transition-colors border ${
          language === 'zh'
            ? 'bg-kevin-orange text-black border-kevin-orange'
            : 'bg-black bg-opacity-50 text-white border-gray-600 hover:bg-kevin-orange hover:text-black hover:border-kevin-orange'
        }`}
      >
        中文
      </button>
    </div>
  );
}