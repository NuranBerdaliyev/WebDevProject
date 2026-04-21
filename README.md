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
- POST /api/login/
- POST /api/token/refresh/
- POST /api/logout/   (body: {"refresh": "<refresh_token>"})
- GET /api/movies/
- POST /api/movies/
- GET /api/movies/{id}/
- PUT /api/movies/{id}/
- DELETE /api/movies/{id}/
- GET /api/docs/      (Swagger UI)
- GET /api/schema/    (OpenAPI schema)

