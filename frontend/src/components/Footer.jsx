import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    ['Аудио описание', 'Инвесторам', 'Правовые уведомления'],
    ['Справочный центр', 'Вакансии', 'Настройки cookie'],
    ['Подарочные карты', 'Условия использования', 'Корпоративная информация'],
    ['Медиацентр', 'Конфиденциальность', 'Свяжитесь с нами'],
  ];

  return (
    <footer className="px-4 sm:px-8 lg:px-12 py-12 text-gray-400 text-sm">
      <div className="max-w-5xl mx-auto">
        {/* Социальные иконки */}
        <div className="flex gap-6 mb-8">
          <a href="#" className="hover:text-white transition">
            <Facebook size={24} />
          </a>
          <a href="#" className="hover:text-white transition">
            <Instagram size={24} />
          </a>
          <a href="#" className="hover:text-white transition">
            <Twitter size={24} />
          </a>
          <a href="#" className="hover:text-white transition">
            <Youtube size={24} />
          </a>
        </div>

        {/* Ссылки */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {footerLinks.map((column, index) => (
            <div key={index} className="flex flex-col gap-3">
              {column.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="hover:underline text-xs sm:text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        {/* Кнопка сервисного кода */}
        <button className="border border-gray-400 px-4 py-1 hover:text-white hover:border-white transition mb-4 text-xs sm:text-sm">
          Сервисный код
        </button>

        {/* Копирайт */}
        <p className="text-xs">© {currentYear} Netflix Clone</p>
      </div>
    </footer>
  );
};

export default Footer;