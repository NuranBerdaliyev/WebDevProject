from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Genre, Movie, Review


class MovieApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pass12345')
        self.genre = Genre.objects.create(name='Drama', description='Drama movies')
        self.movie = Movie.objects.create(
            title='Test Movie',
            description='Test description',
            genre=self.genre,
            release_date='2024-01-01',
            poster_url='https://example.com/poster.jpg',
            rating=8.0
        )

    def test_movie_list_available_for_anonymous(self):
        response = self.client.get('/api/movies/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_movie_create_requires_auth(self):
        payload = {
            'title': 'New Movie',
            'description': 'New',
            'genre': self.genre.id,
            'release_date': '2024-02-01',
            'poster_url': 'https://example.com/new.jpg',
            'rating': 7.5
        }
        response = self.client.post('/api/movies/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_review_sets_user(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'movie': self.movie.id,
            'rating': 9,
            'text': 'Great movie'
        }
        response = self.client.post('/api/reviews/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        review = Review.objects.get(id=response.data['id'])
        self.assertEqual(review.user, self.user)

    def test_review_rating_validation(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'movie': self.movie.id,
            'rating': 11,
            'text': 'Invalid rating'
        }
        response = self.client.post('/api/reviews/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('rating', response.data)


class AuthApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='authuser', password='pass12345')

    def test_login_returns_tokens(self):
        response = self.client.post('/api/login/', {
            'username': 'authuser',
            'password': 'pass12345'
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_logout_blacklists_refresh_token(self):
        login_response = self.client.post('/api/login/', {
            'username': 'authuser',
            'password': 'pass12345'
        }, format='json')
        refresh = login_response.data['refresh']

        logout_response = self.client.post('/api/logout/', {
            'refresh': refresh
        }, format='json')
        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)

        refresh_response = self.client.post('/api/token/refresh/', {
            'refresh': refresh
        }, format='json')
        self.assertEqual(refresh_response.status_code, status.HTTP_401_UNAUTHORIZED)
