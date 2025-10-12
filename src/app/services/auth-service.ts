import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';

export interface Authentication {
  userid: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'https://localhost:3000/api/auth';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  private userRoleSubject = new BehaviorSubject<string | null>(this.getStoredUserRole());
  private userNameSubject = new BehaviorSubject<string | null>(this.getStoredUserName());
  private userIdSubject = new BehaviorSubject<number | null>(this.getStoredUserId());

  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();
  userRole$: Observable<string | null> = this.userRoleSubject.asObservable();
  userName$: Observable<string | null> = this.userNameSubject.asObservable();
  userId$: Observable<number | null> = this.userIdSubject.asObservable();

  login(credentials: Authentication): Observable<AuthResponse> {
    console.log(credentials);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          this.isAuthenticatedSubject.next(true);
          sessionStorage.setItem('token', response.token);
          const userRole = this.getUserRoleFromToken(response.token);
          sessionStorage.setItem('userRole', userRole);
          this.userRoleSubject.next(userRole);
          const userId = parseInt(this.getUserIdFromToken(response.token));
          sessionStorage.setItem('userId', userId.toString());
          this.userIdSubject.next(userId);
          const userName = this.getUserNamefromToken(response.token);
          sessionStorage.setItem('userName', userName);
          this.userNameSubject.next(userName);
        }
      })
    );
  }
  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }
  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('userId');
    this.isAuthenticatedSubject.next(false);
    this.userRoleSubject.next(null);
    this.userIdSubject.next(null);
    this.router.navigate(['/login']);

    sessionStorage.removeItem('Current-AY');
    sessionStorage.removeItem('Selected-AY');
  }

  decodeToken(token: string): any {
    try {
      // JWT is base64-encoded; split into header, payload, and signature
      const payloadBase64 = token.split('.')[1];
      // Decode base64 and parse JSON
      const decoded = atob(payloadBase64);
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
  isTokenValid(token: string): boolean {
    try {
      // Decode the JWT token
      const payload = this.decodeToken(token);
      if (!payload || !payload.exp) {
        return false;
      }
      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      const buffer = 5; // 5-second buffer for clock skew
      return payload.exp > currentTime + buffer;
    } catch (error) {
      console.error('Error validating token:', error);
      return false;
    }
  }

  getUserIdFromToken(token: string): string {
    try {
      const payload = this.decodeToken(token);
      return payload?.['UserId'] || '';
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  private getUserNamefromToken(token: string): string {
    try {
      const payload = this.decodeToken(token);
      return payload?.['UserName'] || '';
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  private getUserRoleFromToken(token: string): string {
    try {
      const payload = this.decodeToken(token);
      return payload?.['UserRole'] || '';
    } catch (error) {
      console.error('Error decoding token:', error);
      return '';
    }
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => error);
  }

  private getStoredUserRole(): string | null {
    const userRole = sessionStorage.getItem('userRole');
    return userRole ?? null;
  }

  private getStoredUserId(): number | null {
    const userId = sessionStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  }

  private getStoredUserName(): string | null {
    const userId = sessionStorage.getItem('userName');
    return userId ?? null;
  }
}
