from django.contrib import admin
from .models import Genre, Movie, Review, WatchlistItem

@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'genre', 'rating', 'release_date']
    list_filter = ['genre', 'rating']
    search_fields = ['title']

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'movie', 'rating', 'created_at']
    list_filter = ['movie', 'rating', 'created_at']
    search_fields = ['user__username', 'movie__title']

@admin.register(WatchlistItem)
class WatchlistItemAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'movie', 'added_at']
    list_filter = ['added_at']
    search_fields = ['user__username', 'movie__title']
