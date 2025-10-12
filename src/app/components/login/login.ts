import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { AcademicyearService } from '../../services/academicyear-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinner,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;
  submitted: boolean = false;
  /**
   *
   */
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ayService = inject(AcademicyearService);
  private cdr = inject(ChangeDetectorRef);
  constructor() {
    this.loginForm = this.fb.group({
      userid: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }
  ngOnInit(): void {}

  get userid() {
    return this.loginForm.get('userid');
  }
  get password() {
    return this.loginForm.get('password');
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(
      (this.submitted || (control && (control.dirty || control.touched))) &&
      control &&
      control.invalid
    );
  }
  submitLogin() {
    this.submitted = true;
    this.isLoading = true;
    this.cdr.markForCheck();
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.setAyValues();
          this.router.navigate(['/users/select-service']);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 401) {
            this.errorMessage = 'Invalid username or password. Please try again.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
          this.cdr.markForCheck();
        },
      });
    } else {
      this.isLoading = false;
      var userid = this.loginForm.get('userid')?.value;
      if (userid === '') {
        this.errorMessage = 'Invalid User Name';
      } else if (userid.length <= 3) {
        this.errorMessage = 'Username must be at least 3 characters long';
      }
      this.cdr.markForCheck();
    }
  }

  clearError() {
    this.errorMessage = '';
  }

  setAyValues() {
    this.ayService.checkAndAutoActivateAcademicYear().subscribe({
      next: (res) => {
        console.log(res);
        sessionStorage.setItem('Current-AY', res.name);
      },
    });
  }
}
