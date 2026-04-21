# Movie Catalog System

Group members: Nuran Berdaliyev, Aslan Alzhanov, Adi Dosabaev

## Description
Web application for browsing, adding, and reviewing movies.  
Built with Angular (frontend) and Django REST Framework (backend).

## Features
- JWT Authentication (login/logout)
- CRUD operations for movies
- Add and view reviews
- Filter movies by genre
- User-specific actions (reviews, watchlist)

## Technologies
### Frontend
- Angular
- TypeScript
- HttpClient

### Backend
- Django
- Django REST Framework
- JWT Authentication

## Models
- Movie
- Genre
- Review
- User

## API Endpoints

### Authentication
- `POST /api/login/` 
- `POST /api/token/refresh/`
- `POST /api/logout/`

### Movies
- `GET /api/movies/`(?genre=, ?search=, ?sort=)
- `POST /api/movies/` (only admin)
- `GET /api/movies/{id}/`
- `PUT /api/movies/{id}/`(only admin)
- `DELETE /api/movies/{id}/`(only admin)

### Genres
- `GET /api/genres/`
- `GET /api/genres/{id}/`

### Reviews
- `GET /api/reviews/`(?movie=, sort=-created_at)
- `POST /api/reviews/`(auth required)
- `GET /api/reviews/{id}/`
- `PUT /api/reviews/{id}/`(only owner)
- `DELETE /api/reviews/{id}/` (only owner)

### Watchlist
- `GET /api/watchlist/`(auth required)
- `POST /api/watchlist/`(auth required)
- `DELETE /api/watchlist/{id}/`(auth required)

### Documentation
- `GET /api/docs/` — Swagger UI
- `GET /api/redoc/` — ReDoc
- `GET /api/schema/` — OpenAPI schema

