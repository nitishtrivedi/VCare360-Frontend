import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-service-selector',
  imports: [MatCardModule],
  templateUrl: './service-selector.html',
  styleUrl: './service-selector.css',
  standalone: true,
})
export class ServiceSelector implements OnInit {
  userName: string | null = '';
  ngOnInit(): void {
    this.userName = sessionStorage.getItem('userName');
  }
  private router = inject(Router);
  onSelect(option: string): void {
    // if (option === 'daycare') {
    //   this.router.navigate(['/daycare']);
    // } else if (option === 'preschool') {
    //   this.router.navigate(['/preschool/dashboard']);
    // }
    this.router.navigate([option, 'select-ay']);
  }
}
