import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';
import { AuthComponent } from './auth/auth.component';
import { authGuard } from './auth/auth.guard'; 
import { guestGuard } from './auth/guest.guard'; 

export const routes: Routes = [

  { path: '', redirectTo: '/auth', pathMatch: 'full' }, 
  { 
    path: 'list', 
    component: BookListComponent,

  }, 
  { 
    path: 'auth', 
    component: AuthComponent,
    canActivate: [guestGuard] 
  },
  { 
    path: 'add', 
    component: BookFormComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'edit/:id', 
    component: BookFormComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '/auth' }
];