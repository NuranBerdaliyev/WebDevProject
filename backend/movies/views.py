from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Movie, Genre, Review, WatchlistItem
from .serializers import MovieSerializer, GenreSerializer, ReviewSerializer, WatchlistItemSerializer
from .permissions import IsOwnerOrReadOnly
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']  # Default сортировка
    
    def get_queryset(self):
        queryset = Review.objects.all()
        movie_id = self.request.query_params.get('movie')
        
        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        
        return queryset.order_by('-created_at')
    
    def perform_create(self, serializer):
        """Всегда проставляет request.user, запрещает смену в payload"""
        serializer.save(user=self.request.user)
    
    def perform_update(self, serializer):
        """Запрет смены movie при update"""
        if 'movie' in self.request.data and \
           self.request.data['movie'] != self.get_object().movie.id:
            raise serializers.ValidationError(
                {"movie": "Cannot change movie for existing review"}
            )
        serializer.save()

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title']
    ordering_fields = ['release_date', 'rating']

    def get_queryset(self):
        queryset = self.queryset
        genre = self.request.query_params.get('genre')
        if genre:
            queryset = queryset.filter(genre_id=genre)
        return queryset

class WatchlistViewSet(viewsets.ModelViewSet):
    serializer_class = WatchlistItemSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['movie__title']
    ordering_fields = ['added_at', 'movie__title']
    ordering = ['-added_at']
    
    def get_queryset(self):
        """Только свои watchlist items"""
        if self.action in ["list", "create"]:
            return WatchlistItem.objects.filter(user=self.request.user)
        return WatchlistItem.objects.all()
    
    def perform_create(self, serializer):
        """Автоматически проставляет текущего юзера"""
        serializer.save(user=self.request.user)
    
    def destroy(self, request, *args, **kwargs):
        """Удаление из списка"""
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)