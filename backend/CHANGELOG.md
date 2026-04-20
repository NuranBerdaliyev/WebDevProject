# Changelog - Movie Catalog API

## v1.1.0 (2026-04-20)

### ✅ Added
- **Review CRUD improvements:**
  - Unique constraint: one review per user per movie (HTTP 409 if duplicate)
  - Serializer validation: forbid movie change on update
  - Proper permission checks: only owner can update/delete
  - Filter reviews by movie ID: `GET /api/reviews/?movie=1`
  - Sorting by created_at (desc by default)

- **Watchlist API:**
  - New model `WatchlistItem` with user+movie unique constraint
  - `GET /api/watchlist/` — list own items (auth required)
  - `POST /api/watchlist/` — add movie (auth required)
  - `DELETE /api/watchlist/{id}/` — remove item (auth required)
  - Search by movie title: `?search=Inception`
  - Sorting by added_at, movie title

- **Tests:**
  - Review CRUD tests (create, update, delete, permissions)
  - Review duplicate prevention test
  - Watchlist CRUD tests
  - Permission checks (403 for non-owners)
  - Auth requirement tests (401 for anonymous)

- **Security:**
  - CORS whitelist (replaces CORS_ALLOW_ALL_ORIGINS)
  - Settings via .env (SECRET_KEY, DEBUG, ALLOWED_HOSTS)
  - Production-ready secure settings (HTTPS, cookies, CSP)

### 🔧 Changed
- Review model: added `updated_at`, unique_together constraint
- Review serializer: added proper validation, error messages
- ReviewViewSet: filtering, permission checks
- settings.py: moved to env-based config

### 📝 Docs
- Updated README with full API endpoint list
- API_CONTRACT.md aligned with actual routes and payloads
- Added admin interface for Genre, Movie, Review, WatchlistItem

### 🐛 Fixed
- CORS security vulnerability (was allowing all origins)
- Review serializer not preventing movie change on update