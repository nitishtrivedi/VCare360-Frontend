import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AcademicYear {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  //serviceType: string; //RESERVED FOR LATER
}

@Injectable({
  providedIn: 'root',
})
export class AcademicyearService {
  private apiUrl = 'https://localhost:3000/api/academicyear';
  private http = inject(HttpClient);

  getAllAcademicYears(): Observable<AcademicYear[]> {
    return this.http.get<AcademicYear[]>(`${this.apiUrl}`);
  }

  getActiveAcademicYear(): Observable<AcademicYear> {
    return this.http.get<AcademicYear>(`${this.apiUrl}/active`);
  }

  checkAndAutoActivateAcademicYear(): Observable<AcademicYear> {
    return this.http.get<AcademicYear>(`${this.apiUrl}/check-and-auto-activate`);
  }
}
