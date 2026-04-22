from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Genre(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()

class Movie(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE)
    release_date = models.DateField()
    poster_url = models.URLField()
    backdrop_url = models.URLField(null=True, blank=True)  # Добавить
    director = models.CharField(max_length=200, null=True, blank=True)  # Добавить
    cast = models.TextField(null=True, blank=True)  # Добавить (JSON или текст)
    duration_minutes = models.IntegerField(null=True, blank=True)  # Добавить
    rating = models.FloatField(
        validators=[MinValueValidator(1), MaxValueValidator(10)],
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True, null=True)  # Добавить
    updated_at = models.DateTimeField(auto_now=True, null=True)  # Добавить

class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(
    validators=[MinValueValidator(1), MaxValueValidator(10)]
    )
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'movie')

class WatchlistItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'movie')
        ordering = ['-added_at']
    
    def __str__(self):
        return f"{self.user.username} -> {self.movie.title}"
