import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
export interface Enquiry {
  id?: number; // optional for new entries
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
  enquiryDetails?: EnquiryDetails[];
}

export interface EnquiryDetails {
  enquiryId: number; // same as Enquiry.Id
  enquirerName: string;
  enquirerMobile: string;
  programName: string;
  enquiryDate: string;
  gender: string;
  studentName: string;

  // Follow-up fields
  enquiryFollowUpStage: string;
  enquiryFollowUpSubstage: string;
  activityDate: string;
  followUpDate?: string; // New field
  followUpTime: string;
  appointmentVisitDate: string;
  enquiryFollowUpReason?: string; // New field
  enquiryComment?: string; // optional
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

  editEnquiry(enquiry: Enquiry, id: number): Observable<Enquiry> {
    return this.http.put<Enquiry>(`${this.apiurl}/${id}`, enquiry);
  }

  getAllEnquiries(): Observable<Enquiry[]> {
    return this.http.get<Enquiry[]>(this.apiurl);
  }

  getEnquiryById(id: number): Observable<Enquiry> {
    return this.http.get<Enquiry>(`${this.apiurl}/${id}`);
  }

  addFollowUp(enquiryId: number, followUp: EnquiryDetails): Observable<any> {
    return this.http.post(`${this.apiurl}/${enquiryId}/followup`, followUp);
  }
}
