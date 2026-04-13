import { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // В реальном проекте здесь была бы валидация и API запрос
    onLogin();
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Фоновое изображение */}
      <div className="absolute inset-0">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/c906271d-7184-4eec-83c9-b6a4c1a11331/5e68fe29-9e29-41ff-bdbf-dbb5ac3addba/RU-ru-20241028-TRIFECTA-perspective_WEB_3c76c980-1cb6-41c5-b826-91f7672850df_small.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Логотип */}
      <a href="/" className="absolute top-6 left-6 text-netflix-red text-3xl font-bold tracking-wider">
        NETFLIX
      </a>

      {/* Форма */}
      <div className="relative bg-black/75 p-8 sm:p-12 rounded w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold mb-6">
          {isSignUp ? 'Регистрация' : 'Войти'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border-none rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border-none rounded px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-netflix-red text-white font-semibold py-3 rounded hover:bg-red-700 transition"
          >
            {isSignUp ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-400">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded accent-netflix-red" />
            Запомнить меня
          </label>
          <a href="#" className="hover:underline">Нужна помощь?</a>
        </div>

        <div className="mt-8 text-gray-400">
          {isSignUp ? (
            <p>
              Уже есть аккаунт?{' '}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-white hover:underline"
              >
                Войти
              </button>
            </p>
          ) : (
            <p>
              Новенький?{' '}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-white hover:underline"
              >
                Зарегистрируйтесь сейчас
              </button>
            </p>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Это защищено Google reCAPTCHA.
        </div>
      </div>
    </div>
  );
};

export default Login;
