import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { AcademicyearService } from '../../../../services/academicyear-service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Enquiry, Enquiryservice } from '../../../../services/daycare/enquiryservice';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addenquiry',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './addenquiry.html',
  styleUrl: './addenquiry.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Addenquiry implements OnInit {
  enquiryForm: FormGroup;
  enquiryDate: string = '';
  ay: string | null = '';

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

  ngOnInit(): void {}
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

  // applyOtherOptionValue(): void {
  //   const otherValue = this.enquiryForm.value.trim();
  //   if (otherValue) {
  //     this.enquiryForm.get('otherInformation')?.setValue(otherValue);
  //   }
  // }
  // onDropdownOpened(opened: boolean): void {
  //   if (opened) {
  //     this.otherControlOI.reset();
  //   }
  // }

  submitEnquiry() {
    const formValue = this.enquiryForm.value;
    var ayObject = JSON.parse(sessionStorage.getItem('Current-AY-Object') || '{}');
    const ayID = ayObject?.id;

    const payload: Enquiry = {
      academicYearField: formValue.academicYear,
      enquiryDate: formValue.enquiryDateField,
      enquiryAddedBy: formValue.enquiryAddedBy,
      name: formValue.childName,
      dateOfBirth: formValue.childDOB,
      gender: formValue.childGender,
      program: formValue.program,
      enquirerName: formValue.enquirerName,
      enquirerEmail: formValue.enquirerEmail,
      enquirerPhoneNumber: formValue.enquirerPhoneNumber,
      enquirerAddress: formValue.enquirerAddress,
      modeOfInformation: formValue.otherInformation,
      optedForAdmissionForm: formValue.optedForAdmissionForm === 'yes' ? true : false,
      academicYearId: ayID,
      followUpDate: formValue.followUpDate,
    };
    this.enquiryService.addEnquiry(payload).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success!',
          text: 'Enquiry added successfully',
          icon: 'success',
          confirmButtonText: 'Proceed',
        }).then((result) => {
          if (result.isConfirmed) {
            this.router.navigate(['/daycare/enquiries']);
          }
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'Enquiry Could not be added',
          icon: 'error',
          confirmButtonColor: 'Ok',
        });
      },
    });
  }
}
