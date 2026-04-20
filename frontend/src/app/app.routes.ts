import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProtectedTestComponent } from './features/auth/protected-test/protected-test.component';
import { authGuard } from './core/guards/auth.guard';
import { MovieListComponent } from './features/movies/movie-list/movie-list';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'protected',
    component: ProtectedTestComponent,
    canActivate: [authGuard]
  },
  { path: 'movies', component: MovieListComponent },
  {

    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];