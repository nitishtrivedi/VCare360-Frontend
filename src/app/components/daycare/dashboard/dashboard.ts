import { Component, inject, OnInit } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Enquiryservice } from '../../../services/daycare/enquiryservice';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private enqService = inject(Enquiryservice);
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
    const maxEnquiries = 100; //Change if needed
    return (this.totalEnquiries / maxEnquiries) * 100;
  }
}
