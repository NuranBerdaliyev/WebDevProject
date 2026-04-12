from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Movie, Genre, Review
from .serializers import MovieSerializer, GenreSerializer, ReviewSerializer

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def get_queryset(self):
        movie_id = self.request.query_params.get('movie')
        queryset = Review.objects.all()

        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)

        return queryset
