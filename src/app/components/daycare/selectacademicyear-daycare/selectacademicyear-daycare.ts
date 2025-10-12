import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AcademicYear, AcademicyearService } from '../../../services/academicyear-service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-selectacademicyear-daycare',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    DatePipe,
  ],
  templateUrl: './selectacademicyear-daycare.html',
  styleUrl: './selectacademicyear-daycare.css',
})
export class SelectacademicyearDaycare implements OnInit {
  private ayService = inject(AcademicyearService);
  private router = inject(Router);
  selectedYear: AcademicYear | null = null;

  academicYears: AcademicYear[] = [];

  ngOnInit(): void {
    this.ayService.getAllAcademicYears().subscribe({
      next: (res) => {
        this.academicYears = res;
        const activeYear = this.academicYears.find((y) => y.isActive);
        if (activeYear) {
          this.selectedYear = activeYear;
        }
      },
    });
  }

  onSelectAY() {
    if (this.selectedYear) {
      sessionStorage.setItem('Selected-AY', this.selectedYear.name);
      this.router.navigate(['daycare/dashboard']);
    }
  }
}
