import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { combineLatest, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  userRole: string | null = '';
  userName: string | null = '';

  private authSubscription: Subscription[] = [];

  private auth = inject(AuthService);
  private router = inject(Router);
  ngOnInit(): void {
    this.authSubscription.push(
      combineLatest([
        this.auth.isAuthenticated$,
        this.auth.userRole$,
        this.auth.userName$,
      ]).subscribe(([isAuth, role, uName]) => {
        this.isAuthenticated = isAuth;
        this.userRole = role;
        this.userName = uName;
        if (isAuth) {
          const token = sessionStorage.getItem('userToken');
        } else {
          this.userName = '';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.authSubscription.forEach((sub) => sub.unsubscribe());
  }

  logout() {
    this.auth.logout();
  }

  navigateHeaderImage() {
    if (this.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
