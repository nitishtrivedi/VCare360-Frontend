import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth-service';
import { NavigationEnd, Router } from '@angular/router';
import { combineLatest, filter, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  imports: [MatButtonModule, MatMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
  standalone: true,
})
export class Header implements OnInit, OnDestroy {
  @ViewChild('ayMenuTrigger') ayMenuTrigger!: MatMenuTrigger;
  isAuthenticated = signal(false);
  userRole = signal<string | null>('');
  userName = signal<string | null>('');

  private urlSignal = signal('');

  showChangeAY = computed(() => {
    const url = this.urlSignal().toLowerCase();
    const isAuth = this.isAuthenticated();
    // Exclude select-ay pages
    if (url === '/daycare/select-ay' || url === '/preschool/select-ay') {
      return false;
    }
    return isAuth && (url.startsWith('/daycare') || url.startsWith('/preschool'));
  });

  get selectedAY(): string {
    return sessionStorage.getItem('Selected-AY') || 'TEST';
  }

  private authSubscription: Subscription[] = [];

  private auth = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.urlSignal.set(this.router.url);

    this.authSubscription.push(
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          this.urlSignal.set(e.urlAfterRedirects);
        }
      })
    );

    this.authSubscription.push(
      combineLatest([
        this.auth.isAuthenticated$,
        this.auth.userRole$,
        this.auth.userName$,
      ]).subscribe(([isAuth, role, uName]) => {
        this.isAuthenticated.set(isAuth);
        this.userRole.set(role);
        this.userName.set(uName);
        if (isAuth) {
          const token = sessionStorage.getItem('userToken');
        } else {
          this.userName.set('');
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
    if (this.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  openMenu() {
    this.ayMenuTrigger.openMenu();
  }
  closeMenu() {
    this.ayMenuTrigger.closeMenu();
  }
}
