<<<<<<< HEAD
# Movie Catalog System - API Contract

**Версия:** 1.1  
**Дата:** 2026-04-21  
**Базовый URL:** http://localhost:8000/api  
=======

# Movie Catalog System - API Contract

**Версия:** 1.0  
**Дата:** 2026-04-20  
**Базовый URL:** `http://localhost:8000/api` (dev) / `https://api.example.com/api` (prod)  
>>>>>>> 625e08b1 (docs: add api contract to project root)
**Формат:** JSON  
**Аутентификация:** JWT Bearer Token

---

<<<<<<< HEAD
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
=======
## 📋 Содержание

1. [Общие правила](#общие-правила)
2. [Аутентификация](#аутентификация)
3. [Movies (Фильмы)](#movies-фильмы)
4. [Reviews (Рецензии)](#reviews-рецензии)
5. [Genres (Жанры)](#genres-жанры)
6. [Watchlist (Мой список)](#watchlist-мой-список)
7. [User Profile](#user-profile)
8. [Обработка ошибок](#обработка-ошибок)

---

## 🔧 Общие правила

### Форматы данных

- **Даты:** ISO 8601 (`2026-04-20T15:30:00Z`)
- **Таймауты запросов:** 30 сек
- **Лимит размера файла:** 5MB (для изображений)

### Коды ответов

| Код | Значение | Описание |
|-----|----------|---------|
| 200 | OK | Успешный запрос |
| 201 | Created | Ресурс создан |
| 204 | No Content | Успешно удалено/обновлено (без тела ответа) |
| 400 | Bad Request | Некорректные данные |
| 401 | Unauthorized | Требуется авторизация |
| 403 | Forbidden | Доступ запрещен |
| 404 | Not Found | Ресурс не найден |
| 409 | Conflict | Конфликт данных |
| 500 | Server Error | Ошибка сервера |

### Стандартный формат ошибки

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Описание ошибки",
    "details": {
      "field_name": ["Конкретная ошибка поля"]
    }
  }
}
```

### Headers

**Обязательные для авторизованных запросов:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 🔐 Аутентификация

### 1. Вход (Login)

**Endpoint:** `POST /auth/login/`

**Request:**
```json
{
  "username": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
>>>>>>> 625e08b1 (docs: add api contract to project root)
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

<<<<<<< HEAD
**Endpoint:** `POST /api/token/refresh/`
=======
**Endpoint:** `POST /auth/token/refresh/`
>>>>>>> 625e08b1 (docs: add api contract to project root)

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

<<<<<<< HEAD
**Endpoint:** `POST /api/logout/`
=======
**Endpoint:** `POST /auth/logout/`
>>>>>>> 625e08b1 (docs: add api contract to project root)

**Request:**
```json
{
  "refresh": "<refresh_token>"
}
```

<<<<<<< HEAD
**Response (200 OK):**
```json
{
  "message": "Logged out successfully"
}
```

---

## 🎬 Movies
=======
**Response (204 No Content)**

**Headers:** `Authorization: Bearer <access_token>`

---

## 🎬 Movies (Фильмы)
>>>>>>> 625e08b1 (docs: add api contract to project root)

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

<<<<<<< HEAD
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
=======
## 💬 Reviews (Рецензии)

### 1. Получить рецензии фильма

**Endpoint:** `GET /movies/{movie_id}/reviews/`

**Query Parameters:**
```
?sort=-rating              # Сортировка (-rating, -created_at, rating)
&page=1
&limit=10
```

**Response (200 OK):**
```json
{
  "count": 42,
  "next": "http://localhost:8000/api/movies/1/reviews/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "movie_id": 1,
      "user": {
        "id": 1,
        "username": "john_doe",
        "avatar_url": "https://api.example.com/media/avatars/john.jpg"
      },
      "rating": 9,
      "title": "Masterpiece!",
      "text": "One of the best sci-fi movies ever made...",
      "helpful_count": 15,
      "user_helpful": false,
      "created_at": "2026-03-20T10:30:00Z",
      "updated_at": "2026-03-20T10:30:00Z"
    }
  ]
}
```

---

### 2. Создать рецензию

**Endpoint:** `POST /movies/{movie_id}/reviews/`

**Headers:** `Authorization: Bearer <access_token>`
>>>>>>> 625e08b1 (docs: add api contract to project root)

**Request:**
```json
{
<<<<<<< HEAD
  "movie": 1,
  "rating": 9,
  "text": "Great movie"
=======
  "rating": 9,
  "title": "Masterpiece!",
  "text": "One of the best sci-fi movies ever made. The concept is brilliant..."
>>>>>>> 625e08b1 (docs: add api contract to project root)
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
<<<<<<< HEAD
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
=======
  "movie_id": 1,
  "user": {
    "id": 2,
    "username": "current_user",
    "avatar_url": "https://api.example.com/media/avatars/user.jpg"
  },
  "rating": 9,
  "title": "Masterpiece!",
  "text": "One of the best sci-fi movies ever made...",
  "helpful_count": 0,
  "user_helpful": false,
  "created_at": "2026-04-20T15:30:00Z",
  "updated_at": "2026-04-20T15:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Некорректные данные
- `401 Unauthorized` - Требуется авторизация
- `404 Not Found` - Фильм не найден
- `409 Conflict` - Пользователь уже оставил рецензию на этот фильм

---

### 3. Обновить рецензию

**Endpoint:** `PUT /movies/{movie_id}/reviews/{review_id}/`

**Headers:** `Authorization: Bearer <access_token>`

**Request:** (те же поля, что при создании)
```json
{
  "rating": 8,
  "title": "Great movie",
  "text": "Updated review text..."
}
```

**Response (200 OK):** (возвращает обновленный объект)

**Errors:**
- `403 Forbidden` - Можно редактировать только свои рецензии
- `404 Not Found` - Рецензия не найдена

---

### 4. Удалить рецензию

**Endpoint:** `DELETE /movies/{movie_id}/reviews/{review_id}/`

**Headers:** `Authorization: Bearer <access_token>`

**Response (204 No Content)**

**Errors:**
- `403 Forbidden` - Можно удалять только свои рецензии
- `404 Not Found` - Рецензия не найдена

---

### 5. Отметить рецензию как полезную

**Endpoint:** `POST /movies/{movie_id}/reviews/{review_id}/helpful/`

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "helpful": true
}
```

**Response (200 OK):**
```json
{
  "helpful_count": 16,
  "user_helpful": true
}
```

---

## 🏷️ Genres (Жанры)
>>>>>>> 625e08b1 (docs: add api contract to project root)

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

<<<<<<< HEAD
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

=======
## 📋 Watchlist (Мой список)

### 1. Получить мой список

**Endpoint:** `GET /watchlist/`

**Headers:** `Authorization: Bearer <access_token>`

**Query Parameters:**
```
?sort=-added_at             # Сортировка (-added_at, title)
&search=Inception           # Поиск
&page=1
&limit=20
```

**Response (200 OK):**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Inception",
      "rating": 8.8,
      "poster_url": "https://api.example.com/media/posters/inception.jpg",
      "added_at": "2026-04-15T10:30:00Z"
    }
  ]
}
```

---

### 2. Добавить фильм в мой список

**Endpoint:** `POST /watchlist/`

**Headers:** `Authorization: Bearer <access_token>`

**Request:**
```json
{
  "movie_id": 1
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "movie_id": 1,
  "added_at": "2026-04-20T15:30:00Z"
}
```

**Errors:**
- `400 Bad Request` - Фильм уже в списке
- `404 Not Found` - Фильм не найден

---

### 3. Удалить фильм из моего списка

**Endpoint:** `DELETE /watchlist/{movie_id}/`

**Headers:** `Authorization: Bearer <access_token>`

**Response (204 No Content)**

**Errors:**
- `404 Not Found` - Фильм не в списке

>>>>>>> 625e08b1 (docs: add api contract to project root)
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

<<<<<<< HEAD
=======
## 📝 Примеры интеграции (Frontend)

### Angular HttpClient Service

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiUrl = 'http://localhost:8000/api';
  private accessToken = localStorage.getItem('access_token');

  constructor(private http: HttpClient) {}

  // Movies
  getMovies(params?: any): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get(`${this.apiUrl}/movies/`, { params: httpParams });
  }

  getMovieDetails(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/${id}/`);
  }

  // Reviews
  getReviews(movieId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/movies/${movieId}/reviews/`);
  }

  createReview(movieId: number, data: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/movies/${movieId}/reviews/`,
      data,
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
  }

  // Watchlist
  getWatchlist(): Observable<any> {
    return this.http.get(`${this.apiUrl}/watchlist/`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  addToWatchlist(movieId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/watchlist/`,
      { movie_id: movieId },
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    );
  }

  removeFromWatchlist(movieId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/watchlist/${movieId}/`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }
}
```
>>>>>>> 625e08b1 (docs: add api contract to project root)

---

## 🚀 Статусы имплементации

- ✅ **Готово:** Login, Logout, Refresh Token, Get Movies, Movie Details
- 🔄 **В разработке:** Reviews CRUD, Watchlist
- ⏳ **TODO:** Genres, User Profile, Image uploads, Helpful reviews

---

<<<<<<< HEAD
**Версия контракта:** 1.1  
**Последнее обновление:** 2026-04-21
=======
**Версия контракта:** 1.0  
**Последнее обновление:** 2026-04-20
```

---
>>>>>>> 625e08b1 (docs: add api contract to project root)
