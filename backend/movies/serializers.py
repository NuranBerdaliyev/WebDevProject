from django.utils.text import slugify
from rest_framework import serializers
from .models import Movie, Genre, Review, WatchlistItem
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class GenreSerializer(serializers.ModelSerializer):
    slug = serializers.SerializerMethodField()

    class Meta:
        model = Genre
        fields = ['id', 'name', 'slug']

    def get_slug(self, obj):
        return slugify(obj.name)


class MovieSerializer(serializers.ModelSerializer):
    genre = GenreSerializer(read_only=True)
    genre_id = serializers.PrimaryKeyRelatedField(
        source='genre',
        queryset=Genre.objects.all(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Movie
        fields = [
            'id',
            'title',
            'description',
            'genre',
            'genre_id',
            'release_date',
            'rating',
            'poster_url'
        ]

    def to_internal_value(self, data):
        if 'genre_id' not in data and 'genre' in data and not isinstance(data.get('genre'), dict):
            mutable_data = data.copy()
            mutable_data['genre_id'] = mutable_data.get('genre')
            data = mutable_data
        return super().to_internal_value(data)


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

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email or ''
        token['first_name'] = user.first_name or ''
        token['last_name'] = user.last_name or ''
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserPublicSerializer(self.user).data
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )