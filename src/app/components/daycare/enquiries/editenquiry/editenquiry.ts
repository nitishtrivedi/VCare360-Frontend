import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AcademicyearService } from '../../../../services/academicyear-service';
import { Enquiry, Enquiryservice } from '../../../../services/daycare/enquiryservice';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { formatDate } from '@angular/common';
import Swal from 'sweetalert2';
import { DateUtilsService } from '../../../../services/date-utils-service';

@Component({
  selector: 'app-editenquiry',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './editenquiry.html',
  styleUrl: './editenquiry.css',
})
export class Editenquiry implements OnInit {
  enquiryForm: FormGroup;
  enquiryDate: string = '';
  ay: string | null = '';

  enquiry!: Enquiry;

  otherInformationOptions = [
    'Instagram',
    'Facebook',
    'Other Social Media',
    'Advertisement',
    'Other Sources',
  ];
  //otherControlOI = new FormControl('');
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private ayService = inject(AcademicyearService);
  private enquiryService = inject(Enquiryservice);
  private route = inject(ActivatedRoute);
  private dateUtils = inject(DateUtilsService);

  enquiryId!: number;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.enquiryId = +params['id'];
    });
    this.getEnquiry(this.enquiryId);
  }
  /**
   *
   */
  constructor() {
    const today = new Date();
    var formattedDate = formatDate(today, 'dd-MM-yyyy', 'en-US');
    var ay = sessionStorage.getItem('Current-AY');
    var enqAddedby = sessionStorage.getItem('userName');

    this.enquiryForm = this.fb.group({
      academicYear: [ay],
      enquiryDateField: [formattedDate],
      enquiryAddedBy: [enqAddedby],
      childName: [''],
      childDOB: [''],
      childGender: [''],
      program: ['Daycare'],
      enquirerName: [''],
      enquirerEmail: [''],
      enquirerPhoneNumber: [''],
      enquirerAddress: [''],
      otherInformation: [''],
      optedForAdmissionForm: [''],
      followUpDate: [''],
    });
  }

  getEnquiry(id: number) {
    this.enquiryService.getEnquiryById(id).subscribe({
      next: (res) => {
        this.enquiry = res;
        this.enquiryForm.patchValue({
          academicYear: res.academicYearField,
          enquiryDateField: res.enquiryDate,
          enquiryAddedBy: res.enquiryAddedBy,
          childName: res.name,
          childDOB: this.dateUtils.parseDateFromDB(res.dateOfBirth),
          childGender: res.gender,
          program: res.program,
          enquirerName: res.enquirerName,
          enquirerEmail: res.enquirerEmail,
          enquirerPhoneNumber: res.enquirerPhoneNumber,
          enquirerAddress: res.enquirerAddress,
          otherInformation: res.modeOfInformation,
          optedForAdmissionForm: res.optedForAdmissionForm ? 'yes' : 'no',
          followUpDate: this.dateUtils.parseDateFromDB(res.followUpDate),
        });
      },
    });
  }

  submitEnquiry() {
    const formValue = this.enquiryForm.value;
    const ayObject = JSON.parse(sessionStorage.getItem('Current-AY-Object') || '{}');
    const ayID = ayObject?.id;

    const payload: Enquiry = {
      id: this.enquiryId, // ✅ REQUIRED so backend knows which one to edit
      academicYearField: formValue.academicYear,
      enquiryDate: formValue.enquiryDateField,
      enquiryAddedBy: formValue.enquiryAddedBy,
      name: formValue.childName,
      dateOfBirth: this.dateUtils.formatDateForDB(formValue.childDOB),
      gender: formValue.childGender,
      program: formValue.program,
      enquirerName: formValue.enquirerName,
      enquirerEmail: formValue.enquirerEmail,
      enquirerPhoneNumber: formValue.enquirerPhoneNumber,
      enquirerAddress: formValue.enquirerAddress,
      modeOfInformation: formValue.otherInformation,
      optedForAdmissionForm: formValue.optedForAdmissionForm === 'yes',
      academicYearId: ayID,
      followUpDate: this.dateUtils.formatDateForDB(formValue.followUpDate),
      enquiryDetails: this.enquiry.enquiryDetails || [], // ✅ must send empty array so backend doesn't break
    };

    this.enquiryService.editEnquiry(payload, this.enquiryId).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success!',
          text: 'Enquiry updated successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          this.router.navigate(['/daycare/enquiries']);
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'Unable to update enquiry',
          icon: 'error',
        });
      },
    });
  }
}
