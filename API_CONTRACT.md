# Movie Catalog System - API Contract

**Версия:** 1.1  
**Дата:** 2026-04-21  
**Базовый URL:** http://localhost:8000/api  
**Формат:** JSON  
**Аутентификация:** JWT Bearer Token

---

## Содержание

1. Общие правила
2. Аутентификация
3. Movies
4. Genres
5. Reviews
6. Watchlist
7. Обработка ошибок

---

## Общие правила

### Форматы данных
- Даты: ISO 8601, например 2026-04-20T15:30:00Z

### Коды ответов
- 200 OK
- 201 Created
- 204 No Content
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 500 Server Error

### Headers для защищенных endpoint
- Authorization: Bearer <access_token>
- Content-Type: application/json

---

## Аутентификация

### Login
Endpoint: POST /api/login/

Request:
~~~json
{
  "username": "authuser",
  "password": "pass12345"
}

Response (200 OK):
~~~json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "user@example.com",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

**Errors:**
- `401 Unauthorized` - Неверные учетные данные
- `400 Bad Request` - Поле не заполнено

---

### 2. Обновление токена (Refresh Token)

**Endpoint:** `POST /api/token/refresh/`

**Request:**
```json
{
  "refresh": "<refresh_token>"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Errors:**
- `401 Unauthorized` - Токен истек или невалиден

---

### 3. Выход (Logout)

**Endpoint:** `POST /api/logout/`

**Request:**
```json
{
  "refresh": "<refresh_token>"
}
```

**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🎬 Movies

### 1. Получить список фильмов

**Endpoint:** `GET /movies/`

**Query Parameters:**
```
?search=Inception           # Поиск по названию
&genre=action              # Фильтр по жанру (slug)
&sort=-rating              # Сортировка (-rating, -release_date, -created_at)
&page=1                    # Номер страницы (пагинация по 20 шт)
&limit=20                  # Количество результатов на странице
```

**Response (200 OK):**
```json
{
  "count": 156,
  "next": "http://localhost:8000/api/movies/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Inception",
      "description": "A thief who steals corporate secrets...",
      "release_date": "2010-07-16",
      "rating": 8.8,
      "genre": {
        "id": 1,
        "name": "Sci-Fi",
        "slug": "sci-fi"
      },
      "poster_url": "https://api.example.com/media/posters/inception.jpg",
      "backdrop_url": "https://api.example.com/media/backdrops/inception_bg.jpg",
      "duration_minutes": 148,
      "director": "Christopher Nolan",
      "cast": ["Leonardo DiCaprio", "Marion Cotillard"],
      "reviews_count": 42,
      "is_in_watchlist": false,
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-04-10T15:45:00Z"
    }
  ]
}
```

**Errors:**
- `400 Bad Request` - Некорректные параметры поиска

---

### 2. Получить детали фильма

**Endpoint:** `GET /movies/{id}/`

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Inception",
  "description": "A thief who steals corporate secrets...",
  "release_date": "2010-07-16",
  "rating": 8.8,
  "genre": {
    "id": 1,
    "name": "Sci-Fi",
    "slug": "sci-fi"
  },
  "poster_url": "https://api.example.com/media/posters/inception.jpg",
  "backdrop_url": "https://api.example.com/media/backdrops/inception_bg.jpg",
  "duration_minutes": 148,
  "director": "Christopher Nolan",
  "cast": ["Leonardo DiCaprio", "Marion Cotillard"],
  "reviews_count": 42,
  "is_in_watchlist": false,
  "reviews": [
    {
      "id": 1,
      "user": {
        "id": 1,
        "username": "john_doe",
        "avatar_url": "https://api.example.com/media/avatars/john.jpg"
      },
      "rating": 9,
      "title": "Masterpiece!",
      "text": "One of the best sci-fi movies ever made...",
      "created_at": "2026-03-20T10:30:00Z",
      "updated_at": "2026-03-20T10:30:00Z"
    }
  ],
  "created_at": "2026-01-15T10:30:00Z",
  "updated_at": "2026-04-10T15:45:00Z"
}
```

**Errors:**
- `404 Not Found` - Фильм не найден

---

### 3. Создать фильм (Админ)

**Endpoint:** `POST /movies/`

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "title": "The Matrix",
  "description": "A computer hacker learns about the true nature of reality...",
  "release_date": "1999-03-31",
  "duration_minutes": 136,
  "director": "Lana Wachowski, Lilly Wachowski",
  "cast": ["Keanu Reeves", "Laurence Fishburne"],
  "rating": 8.7,
  "genre_id": 2
}
```

**Response (201 Created):**
```json
{
  "id": 100,
  "title": "The Matrix",
  "description": "A computer hacker learns about the true nature of reality...",
  "release_date": "1999-03-31",
  "duration_minutes": 136,
  "director": "Lana Wachowski, Lilly Wachowski",
  "cast": ["Keanu Reeves", "Laurence Fishburne"],
  "rating": 8.7,
  "genre": {
    "id": 2,
    "name": "Action",
    "slug": "action"
  },
  "poster_url": null,
  "backdrop_url": null,
  "reviews_count": 0,
  "is_in_watchlist": false,
  "created_at": "2026-04-20T10:30:00Z",
  "updated_at": "2026-04-20T10:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Некорректные данные
- `401 Unauthorized` - Не авторизован
- `403 Forbidden` - Нет прав администратора

---

### 4. Обновить фильм (Админ)

**Endpoint:** `PUT /movies/{id}/`

**Headers:** `Authorization: Bearer <access_token>`

**Request:** (те же поля, что при создании)
```json
{
  "title": "The Matrix Reloaded",
  "rating": 7.2
}
```

**Response (200 OK):** (возвращает обновленный объект)

**Errors:**
- `404 Not Found` - Фильм не найден
- `403 Forbidden` - Нет прав

---

### 5. Удалить фильм (Админ)

**Endpoint:** `DELETE /movies/{id}/`

**Headers:** `Authorization: Bearer <access_token>`

**Response (204 No Content)**

**Errors:**
- `404 Not Found` - Фильм не найден
- `403 Forbidden` - Нет прав

---

## 💬 Reviews

### 1. Получить рецензии

**Endpoint:** POST /api/reviews/

**Query Parameters:**
- movie=1 (опционально)
- ordering=-created_at
- ordering=created_at
- ordering=-rating
- ordering=rating

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "movie": 1,
    "user": "user1",
    "rating": 9,
    "text": "Great movie",
    "created_at": "2026-04-20T15:30:00Z",
    "updated_at": "2026-04-20T15:30:00Z"
  }
]
```

### 2. Создать рецензию

**Endpoint:** POST /api/reviews/

**Headers:** Authorization: Bearer <access_token>

**Request:**
```json
{
  "movie": 1,
  "rating": 9,
  "text": "Great movie"
}
```

**Validation Rules:**
- `rating`: 1-10 (обязательно)
- `title`: 1-200 символов (обязательно)
- `text`: 1-5000 символов (опционально)

**Response (201 Created):**
```json
{
  "id": 43,
  "movie": 1,
  "user": "current_user",
  "rating": 9,
  "text": "Great movie",
  "created_at": "2026-04-20T15:30:00Z",
  "updated_at": "2026-04-20T15:30:00Z"
}

**Errors:**
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found

### 3. Обновить рецензию

**Endpoint:** PUT /api/reviews/{id}/

**Headers:** Authorization: Bearer <access_token>

**Request:**
{
  "movie": 1,
  "rating": 8,
  "text": "Updated review"
}

**Response (200 OK):** возвращает обновленный объект

### 4. Удалить рецензию

**Endpoint:** DELETE /api/reviews/{id}/

**Headers:** Authorization: Bearer <access_token>

**Response (204 No Content)**

---

## 🏷️ Genres

### 1. Получить все жанры

**Endpoint:** `GET /genres/`

**Response (200 OK):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Sci-Fi",
      "slug": "sci-fi",
      "movies_count": 45
    },
    {
      "id": 2,
      "name": "Action",
      "slug": "action",
      "movies_count": 78
    },
    {
      "id": 3,
      "name": "Drama",
      "slug": "drama",
      "movies_count": 92
    }
  ]
}
```

---

## 📋 Watchlist

### 1. Получить мой список

**Endpoint:** GET /api/watchlist/

**Headers:** Authorization: Bearer <access_token>

**Query Parameters:**
- search=Inception
- ordering=-added_at
- ordering=added_at
- ordering=movie__title
- ordering=-movie__title

**Response (200 OK):**
[
  {
    "id": 1,
    "movie": 1,
    "movie_detail": {
      "id": 1,
      "title": "Inception",
      "description": "A thief who steals corporate secrets...",
      "genre": 1,
      "release_date": "2010-07-16",
      "rating": 8.8,
      "poster_url": "https://example.com/poster.jpg"
    },
    "added_at": "2026-04-20T15:30:00Z"
  }
]

### 2. Добавить фильм в мой список

**Endpoint:** POST /api/watchlist/

**Headers:** Authorization: Bearer <access_token>

**Request:**
{
  "movie": 1
}

**Response (201 Created):**
{
  "id": 1,
  "movie": 1,
  "movie_detail": {
    "id": 1,
    "title": "Inception",
    "description": "A thief who steals corporate secrets...",
    "genre": 1,
    "release_date": "2010-07-16",
    "rating": 8.8,
    "poster_url": "https://example.com/poster.jpg"
  },
  "added_at": "2026-04-20T15:30:00Z"
}

**Errors:**
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found

### 3. Удалить фильм из списка

**Endpoint:** DELETE /api/watchlist/{id}/

**Headers:** Authorization: Bearer <access_token>

**Response (204 No Content)**

---

## 👤 User Profile

### 1. Получить профиль текущего пользователя

**Endpoint:** `GET /user/profile/`

**Headers:** `Authorization: Bearer <access_token>`

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "avatar_url": "https://api.example.com/media/avatars/john.jpg",
  "bio": "Movie enthusiast",
  "reviews_count": 15,
  "watchlist_count": 8,
  "joined_at": "2026-01-10T10:30:00Z"
}
```

---

### 2. Обновить профиль

**Endpoint:** `PUT /user/profile/`

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "bio": "Updated bio",
  "avatar": "<file_data>"
}
```

**Response (200 OK):** (возвращает обновленный профиль)

---

### 3. Изменить пароль

**Endpoint:** `POST /user/change-password/`

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "old_password": "currentPassword123",
  "new_password": "newPassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Errors:**
- `400 Bad Request` - Старый пароль неверен

---

## ⚠️ Обработка ошибок

### Примеры типовых ошибок:

**1. Неверные учетные данные:**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid username or password",
    "details": null
  }
}
```
**HTTP:** 401 Unauthorized

---

**2. Ошибка валидации:**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "title": ["This field may not be blank"],
      "rating": ["Ensure this value is between 1 and 10"]
    }
  }
}
```
**HTTP:** 400 Bad Request

---

**3. Недостаточно прав:**
```json
{
  "error": {
    "code": "PERMISSION_DENIED",
    "message": "You do not have permission to perform this action",
    "details": null
  }
}
```
**HTTP:** 403 Forbidden

---

**4. Ресурс не найден:**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Movie with id 999 not found",
    "details": null
  }
}
```
**HTTP:** 404 Not Found

---


---

## 🚀 Статусы имплементации

- ✅ **Готово:** Login, Logout, Refresh Token, Get Movies, Movie Details
- 🔄 **В разработке:** Reviews CRUD, Watchlist
- ⏳ **TODO:** Genres, User Profile, Image uploads, Helpful reviews

---

**Версия контракта:** 1.1  
**Последнее обновление:** 2026-04-21
