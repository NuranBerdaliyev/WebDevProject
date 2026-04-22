from rest_framework import serializers
from .models import Movie, Genre, Review, WatchlistItem

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'description']

class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'genre', 'release_date', 'rating', 'poster_url']


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Show username
    
    class Meta:
        model = Review
        fields = ['id', 'movie', 'user', 'rating', 'text', 'created_at', 'updated_at']
        read_only_fields = ['user', 'created_at', 'updated_at']

    def validate_rating(self, value):
        if not (1 <= value <= 10):
            raise serializers.ValidationError("Rating must be between 1 and 10")
        return value
    
    def validate(self, data):
        # Duplicate review check on create
        if self.instance is None:  # CREATE
            user = self.context['request'].user
            movie = data.get('movie')
            if Review.objects.filter(user=user, movie=movie).exists():
                raise serializers.ValidationError(
                    {"detail": "You have already reviewed this movie"}
                )
        return data
    
    def to_representation(self, instance):
        """Prevent changing movie on update."""
        data = super().to_representation(instance)
        return data


class WatchlistItemSerializer(serializers.ModelSerializer):
    movie_detail = MovieSerializer(source='movie', read_only=True)
    
    class Meta:
        model = WatchlistItem
        fields = ['id', 'movie', 'movie_detail', 'added_at']
        read_only_fields = ['user', 'added_at']
    
    def validate(self, data):
        request = self.context.get("request")
        user = request.user if request else None
        movie = data.get("movie")

        if user and movie and WatchlistItem.objects.filter(user=user, movie=movie).exists():
            raise serializers.ValidationError({"detail": "Movie already in watchlist"})
        return data