import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="row justify-content-center mt-5">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-header bg-primary text-white">
            {{ isLoginMode ? 'Prisijungimas' : 'Registracija' }}
          </div>
          <div class="card-body">
            <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
            <div *ngIf="isLoading" class="text-center mb-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>

            <form #authForm="ngForm" (ngSubmit)="onSubmit(authForm)" *ngIf="!isLoading">
              <div class="mb-3">
                <label for="email" class="form-label">El. paštas</label>
                <input type="email" id="email" class="form-control" ngModel name="email" required email />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Slaptažodis</label>
                <input type="password" id="password" class="form-control" ngModel name="password" required minlength="6" />
              </div>
              <div class="d-grid gap-2">
                <button class="btn btn-primary" type="submit" [disabled]="!authForm.valid">
                  {{ isLoginMode ? 'Prisijungti' : 'Registruotis' }}
                </button>
                <button class="btn btn-outline-secondary" type="button" (click)="onSwitchMode()">
                  Perjungti į {{ isLoginMode ? 'Registraciją' : 'Prisijungimą' }}
                </button>
                
                <hr class="my-2">
                <button class="btn btn-info text-white" type="button" (click)="onGuestVisit()">
                  Peržiūrėti knygas (be registracijos)
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onGuestVisit() {
    this.router.navigate(['/list']);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<any>;

    this.isLoading = true;
    this.error = null;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe({
      next: (resData) => {
        this.isLoading = false;
        this.router.navigate(['/list']);
      },
      error: (errorMessage) => {
        this.error = errorMessage;
        this.isLoading = false;
      }
    });

    form.reset();
  }
}