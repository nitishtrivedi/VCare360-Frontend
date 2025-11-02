import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Enquiryservice } from '../../../services/daycare/enquiryservice';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private enqService = inject(Enquiryservice);
  private router = inject(Router);
  totalEnquiries: number = 0;
  ngOnInit(): void {
    this.loadNumberOfEnquiries();
  }

  loadNumberOfEnquiries() {
    this.enqService.getAllEnquiries().subscribe({
      next: (res) => {
        this.totalEnquiries = res.length;
      },
    });
  }

  get progressValue() {
    const maxEnquiries = 50; //Change if needed
    return (this.totalEnquiries / maxEnquiries) * 100;
  }

  navigateToEnquiries() {
    this.router.navigate(['/daycare/enquiries']);
  }
}
