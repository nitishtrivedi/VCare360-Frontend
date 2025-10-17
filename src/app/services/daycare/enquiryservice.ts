import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Enquiry {
  enquiryId?: number; // optional for new entries
  academicYearField: string;
  enquiryDate: string;
  enquiryAddedBy: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  program: string;
  enquirerName: string;
  enquirerEmail: string;
  enquirerPhoneNumber: string;
  enquirerAddress: string;
  modeOfInformation: string;
  optedForAdmissionForm: boolean;
  academicYearId: number;
  followUpDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Enquiryservice {
  private apiurl = 'https://localhost:3000/api/enquiry';
  private http = inject(HttpClient);

  addEnquiry(enquiry: Enquiry): Observable<Enquiry> {
    return this.http.post<Enquiry>(this.apiurl, enquiry);
  }
}
