# StreamFlix - Netflix Clone

Group members: Nuran Berdaliyev, Aslan Alzhanov, Adi Dosabaev

## Description
A Netflix-like web application for streaming movies with viewing progress tracking, recommendations, and user profiles.  
Built with Angular (frontend) and Django REST Framework (backend).

## Features
### Authentication & User Management
- JWT Authentication (login/register/logout)
- Token persistence in localStorage
- User profile with avatar generation from initials
- Password change functionality

### Movie Features
- Browse movies with Netflix-style UI
- View movie details in modal with hero image
- Genre filtering
- Like/Dislike movies with visual feedback
- Add/remove favorites (watchlist)
- Continue watching with progress bars
- Video player with progress tracking (auto-save every 10s)
- Resume playback from where left off

### Reviews
- View movie reviews
- Add new reviews
- User-specific review management

### Mobile Support
- Responsive design for all screen sizes
- Mobile navigation with hamburger menu
- Touch-friendly controls

## Technologies
### Frontend
- Angular 19 (standalone components)
- TypeScript
- RxJS (BehaviorSubject for state management)
- HttpClient with interceptors

### Backend
- Django 5.2
- Django REST Framework
- SimpleJWT for authentication
- CORS enabled

## Models
### Core
- Movie (with video_url, backdrop_url, duration, cast, director)
- Genre
- Review
- User

### User-Specific
- Watchlist (favorites)
- ViewingProgress (tracking watch history)
- MovieLike (like/dislike reactions)

## API Endpoints
### Auth
- POST /api/register/
- POST /api/login/
- POST /api/token/refresh/
- POST /api/logout/
- GET /api/user/me/
- PUT /api/user/update/
- POST /api/change-password/

### Movies
- GET /api/movies/
- POST /api/movies/
- GET /api/movies/{id}/
- PUT /api/movies/{id}/
- DELETE /api/movies/{id}/

### Watchlist (Favorites)
- GET /api/watchlist/
- POST /api/watchlist/
- DELETE /api/watchlist/{movie_id}/
- GET /api/watchlist/check/{movie_id}/

### Viewing Progress
- GET /api/progress/
- POST /api/progress/
- PUT /api/progress/{movie_id}/
- GET /api/continue-watching/

### Reviews
- GET /api/movies/{id}/reviews/
- POST /api/movies/{id}/reviews/
- DELETE /api/reviews/{id}/

### Likes
- POST /api/movies/{id}/like/
- POST /api/movies/{id}/dislike/
- DELETE /api/movies/{id}/reaction/
- GET /api/movies/{id}/check-reaction/

### Documentation
- GET /api/docs/      (Swagger UI)
- GET /api/schema/    (OpenAPI schema)

## Setup
### Backend
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm install
ng serve
```

## API Contract
See `API_CONTRACT.md` for detailed API documentation.

