import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listenquiry',
  imports: [MatButtonModule],
  templateUrl: './listenquiry.html',
  styleUrl: './listenquiry.css',
  standalone: true,
})
export class Listenquiry {
  private router = inject(Router);
  addEnquiry() {
    this.router.navigate(['/daycare/enquiries/add']);
  }
}
