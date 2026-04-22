from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Movie, Genre, Review, WatchlistItem
from .serializers import MovieSerializer, GenreSerializer, ReviewSerializer, WatchlistItemSerializer, CustomTokenObtainPairSerializer, RegisterSerializer
from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from rest_framework.response import Response
from rest_framework import status, serializers
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAdminOrReadOnly]


class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    filter_backends = [OrderingFilter]
    ordering_fields = ['rating', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Review.objects.all()
        movie_id = self.request.query_params.get('movie')

        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if 'movie' in self.request.data and \
           str(self.request.data['movie']) != str(self.get_object().movie.id):
            raise serializers.ValidationError(
                {"movie": "Cannot change movie for existing review"}
            )
        serializer.save()


class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAdminOrReadOnly]
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
        if self.action in ["list", "create"]:
            return WatchlistItem.objects.filter(user=self.request.user)
        return WatchlistItem.objects.all()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class TokenBlacklistView(TokenBlacklistView):
    pass


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            },
            status=status.HTTP_201_CREATED
        )


class LogoutView(TokenBlacklistView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == status.HTTP_200_OK:
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        return response