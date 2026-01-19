import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router'; 
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('knygu-sistema');

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    this.authService.autoLogin();
  }

  onLogout() {
    this.authService.logout();
  }
}