from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MovieViewSet, GenreViewSet, ReviewViewSet, WatchlistViewSet

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movies')
router.register(r'genres', GenreViewSet, basename='genres')
router.register(r'reviews', ReviewViewSet, basename='reviews')
router.register(r'watchlist', WatchlistViewSet, basename='watchlist')

urlpatterns = [
    path('', include(router.urls)),
]