import { useState, useEffect } from 'react';
import { Search, Bell, User, LogOut, X } from 'lucide-react';

const Header = ({ onLogout, searchQuery, onSearchChange, showSearch, onCloseSearch }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchClick = () => {
    setShowSearchInput(true);
  };

  const handleSearchClose = () => {
    setShowSearchInput(false);
    onCloseSearch();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-netflix-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4">
        {/* Левая часть - Логотип и навигация */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            onClick={(e) => { e.preventDefault(); onCloseSearch(); }}
            className="text-netflix-red text-2xl sm:text-3xl font-bold tracking-wider"
          >
            NETFLIX
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onCloseSearch(); }}
              className="hover:text-gray-300 transition"
            >
              Главная
            </a>
            <a href="#" className="hover:text-gray-300 transition">Сериалы</a>
            <a href="#" className="hover:text-gray-300 transition">Фильмы</a>
            <a href="#" className="hover:text-gray-300 transition">Новое</a>
            <a href="#" className="hover:text-gray-300 transition">Мой список</a>
          </nav>
        </div>

        {/* Правая часть - Поиск, уведомления, профиль */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Поиск */}
          <div className="flex items-center">
            {showSearchInput || showSearch ? (
              <div className="flex items-center bg-black/80 border border-white/30 rounded px-3 py-1">
                <Search size={20} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Фильмы, сериалы..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="bg-transparent border-none px-2 text-sm w-40 sm:w-64 focus:outline-none text-white placeholder-gray-400"
                  autoFocus
                />
                <button
                  onClick={handleSearchClose}
                  className="p-1 hover:text-gray-300 transition"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSearchClick}
                className="p-1 hover:text-gray-300 transition"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Уведомления */}
          <button className="relative p-1 hover:text-gray-300 transition">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-netflix-red rounded-full"></span>
          </button>

          {/* Профиль */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer">
              <User size={18} />
            </div>
            <button
              onClick={onLogout}
              className="p-1 hover:text-gray-300 transition"
              title="Выйти"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;