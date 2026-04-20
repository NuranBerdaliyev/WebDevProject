import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProtectedTestComponent } from './features/auth/protected-test/protected-test.component';
import { authGuard } from './core/guards/auth.guard';
import { MovieListComponent } from './features/movies/movie-list/movie-list';
import { ReviewFormComponent } from './features/reviews/review-form/review-form.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { path: 'movies', component: MovieListComponent },
  { path: 'reviews/add/:movieId', component: ReviewFormComponent, canActivate: [authGuard] },
  {
    path: 'protected',
    component: ProtectedTestComponent,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
