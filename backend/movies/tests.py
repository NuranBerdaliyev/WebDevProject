from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Genre, Movie, Review, WatchlistItem


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


class ReviewDetailTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass')
        self.user2 = User.objects.create_user(username='user2', password='pass')
        self.genre = Genre.objects.create(name='Drama', description='Drama')
        self.movie = Movie.objects.create(
            title='Test Movie', description='Desc',
            genre=self.genre, release_date='2024-01-01',
            poster_url='https://test.jpg', rating=8.0
        )

    def test_anonymous_cannot_create_review(self):
        """POST /api/reviews/ should return 401 for anonymous user."""
        response = self.client.post('/api/reviews/', {
            'movie': self.movie.id, 'rating': 8, 'text': 'Good'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_cannot_create_duplicate_review(self):
        """One user cannot leave two reviews for the same movie."""
        self.client.force_authenticate(user=self.user1)

        # First review - OK
        response1 = self.client.post('/api/reviews/', {
            'movie': self.movie.id, 'rating': 8, 'text': 'Good'
        }, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # Second review - 400
        response2 = self.client.post('/api/reviews/', {
            'movie': self.movie.id, 'rating': 9, 'text': 'Great'
        }, format='json')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('detail', response2.data)

    def test_owner_can_update_review(self):
        """Owner can update own review."""
        review = Review.objects.create(
            movie=self.movie, user=self.user1, rating=7, text='OK'
        )
        self.client.force_authenticate(user=self.user1)

        response = self.client.put(f'/api/reviews/{review.id}/', {
            'movie': self.movie.id, 'rating': 8, 'text': 'Better'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'], 8)

    def test_anonymous_cannot_update_review(self):
        """Non-owner cannot update another user's review."""
        review = Review.objects.create(
            movie=self.movie, user=self.user1, rating=7, text='OK'
        )
        response = self.client.put(f'/api/reviews/{review.id}/', {
            'movie': self.movie.id,
            'rating': 9,
            'text': 'Changed'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_non_owner_cannot_update_review(self):
        review = Review.objects.create(
            movie=self.movie, user=self.user1, rating=7, text='OK'
        )
        self.client.force_authenticate(user=self.user2)

        response = self.client.put(
            f'/api/reviews/{review.id}/',
            {'movie': self.movie.id, 'rating': 9, 'text': 'Hacked'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_cannot_delete_review(self):
        """Non-owner cannot delete another user's review."""
        review = Review.objects.create(
            movie=self.movie, user=self.user1, rating=7, text='OK'
        )
        response = self.client.delete(f'/api/reviews/{review.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_owner_can_delete_review(self):
        """Owner can delete own review."""
        review = Review.objects.create(
            movie=self.movie, user=self.user1, rating=7, text='OK'
        )
        self.client.force_authenticate(user=self.user1)

        response = self.client.delete(f'/api/reviews/{review.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Review.objects.filter(id=review.id).exists())

    def test_non_owner_cannot_delete_review(self):
        review = Review.objects.create(
            movie=self.movie, user=self.user1, rating=7, text='OK'
        )
        self.client.force_authenticate(user=self.user2)

        response = self.client.delete(f'/api/reviews/{review.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_filter_reviews_by_movie(self):
        """GET /api/reviews/?movie=X works correctly."""
        movie2 = Movie.objects.create(
            title='Another', description='Desc',
            genre=self.genre, release_date='2024-02-01',
            poster_url='https://test2.jpg', rating=7.0
        )
        Review.objects.create(movie=self.movie, user=self.user1, rating=8, text='Good')
        Review.objects.create(movie=movie2, user=self.user2, rating=7, text='OK')

        response = self.client.get(f'/api/reviews/?movie={self.movie.id}')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['movie'], self.movie.id)


class WatchlistTests(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass')
        self.user2 = User.objects.create_user(username='user2', password='pass')
        self.genre = Genre.objects.create(name='Drama', description='Drama')
        self.movie1 = Movie.objects.create(
            title='Movie 1', description='Desc',
            genre=self.genre, release_date='2024-01-01',
            poster_url='https://test1.jpg', rating=8.0
        )
        self.movie2 = Movie.objects.create(
            title='Movie 2', description='Desc',
            genre=self.genre, release_date='2024-02-01',
            poster_url='https://test2.jpg', rating=7.0
        )

    def test_anonymous_cannot_access_watchlist(self):
        """GET /api/watchlist/ should return 401 for anonymous user."""
        response = self.client.get('/api/watchlist/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_watchlist_item(self):
        """Authenticated user can add a movie to watchlist."""
        self.client.force_authenticate(user=self.user1)

        response = self.client.post('/api/watchlist/', {
            'movie': self.movie1.id
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(WatchlistItem.objects.filter(
            user=self.user1, movie=self.movie1
        ).exists())

    def test_cannot_duplicate_watchlist_item(self):
        """Cannot add the same movie to watchlist twice."""
        self.client.force_authenticate(user=self.user1)

        # First addition — OK
        response1 = self.client.post('/api/watchlist/', {
            'movie': self.movie1.id
        }, format='json')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)

        # Second addition — 400
        response2 = self.client.post('/api/watchlist/', {
            'movie': self.movie1.id
        }, format='json')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_returns_only_own_items(self):
        """GET /api/watchlist/ returns only the current user's items."""
        WatchlistItem.objects.create(user=self.user1, movie=self.movie1)
        WatchlistItem.objects.create(user=self.user1, movie=self.movie2)
        WatchlistItem.objects.create(user=self.user2, movie=self.movie1)  # Other user's item

        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/watchlist/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        for item in response.data:
            self.assertIn(item['movie'], [self.movie1.id, self.movie2.id])

    def test_delete_watchlist_item(self):
        """DELETE /api/watchlist/{movie_id}/ removes only the current user's items."""
        item = WatchlistItem.objects.create(user=self.user1, movie=self.movie1)
        self.client.force_authenticate(user=self.user1)

        response = self.client.delete(f'/api/watchlist/{item.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(WatchlistItem.objects.filter(id=item.id).exists())

    def test_cannot_delete_others_watchlist_item(self):
        """Cannot delete another user's watchlist item."""
        item = WatchlistItem.objects.create(user=self.user2, movie=self.movie1)
        self.client.force_authenticate(user=self.user1)

        response = self.client.delete(f'/api/watchlist/{item.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_anonymous_cannot_create_watchlist_item(self):
        response = self.client.post('/api/watchlist/', {
            'movie': self.movie1.id
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_anonymous_cannot_delete_watchlist_item(self):
        item = WatchlistItem.objects.create(user=self.user1, movie=self.movie1)
        response = self.client.delete(f'/api/watchlist/{item.id}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class AdminPermissionsTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin', password='pass12345', is_staff=True
        )
        self.user = User.objects.create_user(
            username='user', password='pass12345'
        )
        self.genre = Genre.objects.create(name='Drama', description='Drama')
        self.movie = Movie.objects.create(
            title='Test Movie',
            description='Desc',
            genre=self.genre,
            release_date='2024-01-01',
            poster_url='https://example.com/poster.jpg',
            rating=8.0
        )

    def test_non_admin_cannot_create_movie(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/movies/', {
            'title': 'New Movie',
            'description': 'Desc',
            'genre': self.genre.id,
            'release_date': '2024-02-01',
            'poster_url': 'https://example.com/new.jpg',
            'rating': 7.5
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_movie(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/movies/', {
            'title': 'Admin Movie',
            'description': 'Desc',
            'genre': self.genre.id,
            'release_date': '2024-02-01',
            'poster_url': 'https://example.com/new.jpg',
            'rating': 7.5
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_non_admin_cannot_create_genre(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/genres/', {
            'name': 'Action',
            'description': 'Action movies'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_genre(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post('/api/genres/', {
            'name': 'Action',
            'description': 'Action movies'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
