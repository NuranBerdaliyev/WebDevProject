# Netflix Clone - Angular Frontend

## Описание
Netflix clone интерфейс на Angular с полным функционалом просмотра фильмов.

## Технологии
- Angular 17+ (Standalone components)
- TypeScript
- RxJS
- CSS (без внешних фреймворков)

## Установка

```bash
npm install
```

## Запуск

```bash
# Development server
ng serve

# Или
npm start
```

Откройте `http://localhost:4200`

## Структура проекта

```
src/app/
├── components/
│   ├── header/          # Шапка с навигацией и поиском
│   ├── hero/            # Баннер с главным фильмом
│   ├── movie-row/       # Горизонтальный список фильмов
│   ├── movie-modal/     # Модальное окно с деталями
│   ├── video-player/    # Видео плеер
│   ├── login/           # Форма входа
│   └── footer/          # Подвал
├── services/
│   └── movie.service.ts # Сервис для работы с фильмами
└── app.component.ts     # Корневой компонент
```

## Функционал

- Просмотр списка фильмов (Trending, Popular, Top Rated)
- Поиск с debounce (300ms)
- Просмотр деталей фильма
- Видео плеер с клавиатурным управлением
- Избранное (сохраняется в localStorage)
- Адаптивный дизайн

## Горячие клавиши плеера

| Клавиша | Действие |
|---------|----------|
| Space | Play/Pause |
| ← | Назад 10 сек |
| → | Вперед 10 сек |
| M | Mute/Unmute |
| F | Fullscreen |
| ESC | Закрыть |

## Mock данные

Сейчас используются mock данные в `movie.service.ts`. Для подключения к backend:
1. Замените методы в `MovieService` на HTTP запросы
2. Обновите API URL в сервисе
