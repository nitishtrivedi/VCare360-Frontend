import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { Enquiry, EnquiryDetails, Enquiryservice } from '../../../services/daycare/enquiryservice';
import {
  MatTable,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCell,
  MatCellDef,
  MatTableDataSource,
} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatFormField, MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatAnchor } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enquiry-followup',
  imports: [
    MatTabsModule,
    MatTable,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatPaginator,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatInput,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatTimepickerModule,
    MatAnchor,
  ],
  templateUrl: './enquiry-followup.html',
  styleUrl: './enquiry-followup.css',
})
export class EnquiryFollowup implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private route = inject(ActivatedRoute);
  private enqService = inject(Enquiryservice);
  private fb = inject(FormBuilder);
  private datePipe = new DatePipe('en-US');
  enquiryId!: number;
  enquiry: Enquiry | null = null;

  enquiryFollowUpForm: FormGroup;

  dataSource = new MatTableDataSource<EnquiryDetails>([]);

  newFollowUp: Partial<EnquiryDetails> = {
    enquiryFollowUpStage: '',
    enquiryFollowUpSubstage: '',
    enquiryComment: '',
    enquiryFollowUpReason: '',
    followUpDate: '',
  };

  displayedColumns: string[] = [
    'activityDate',
    'followUpDate',
    'enquiryFollowUpStage',
    'enquiryFollowUpSubStage',
    'enquiryFollowUpStageReason',
    'enquiryComment',
  ];
  activityDate: string = new Date().toISOString();

  selectedStage: string = '';
  selectedSubStage: string = '';

  showStageReason = false;
  showFollowUpRow = false;
  showAppointmentDatePicker = false;
  showNextActivityDatePicker = false;

  followUpStage: string[] = ['Interested', 'Not Interested', 'Need Follow Up'];
  followUpSubStage: string[] = [];
  stageReasons: string[] = [];

  constructor() {
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(this.activityDate, 'dd-MM-yyyy');
    this.enquiryFollowUpForm = this.fb.group({
      followUpReason: [''],
      followUpSubReason: [''],
      stageReason: [''],
      activityDate: [formattedDate],
      appointmentDate: [''],
      nextFollowUpDate: [''],
      nextFollowUpTime: [''],
      comments: [''],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.enquiryId = +params['id'];
    });
    this.loadEnquiry(this.enquiryId);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadEnquiry(id: number) {
    this.enqService.getEnquiryById(id).subscribe({
      next: (res) => {
        this.enquiry = res;
        if (res.enquiryDetails && Array.isArray(res.enquiryDetails)) {
          this.dataSource.data = res.enquiryDetails;
          if (res.enquiryDetails.length > 0) {
            this.loadLatestEnquiryDetails(res.enquiryDetails);
          }
        } else {
          this.dataSource.data = [];
        }

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onFollowUpStageChange(stage: string) {
    if (stage) {
      this.showFollowUpRow = false;
      this.showStageReason = false;
      this.selectedStage = stage;
      this.selectedSubStage = '';
      this.followUpSubStage = [];

      // Reset dependent fields
      this.enquiryFollowUpForm.patchValue({
        followUpSubReason: '',
        stageReason: '',
      });

      if (stage === 'Interested') {
        this.followUpSubStage = ['New Opportunity', 'Appointment'];
      } else if (stage === 'Not Interested') {
        this.followUpSubStage = ['Closed Lost', 'Invalid Number', 'Not Contactable'];
      } else if (stage === 'Need Follow Up') {
        this.followUpSubStage = ['Call Disconnected', 'Callback Required'];
      }
    }
  }

  onFollowUpSubStageChange(stage: string) {
    if (stage) {
      this.selectedSubStage = stage;

      if (stage === 'New Opportunity' || stage === 'Invalid Number') {
        this.showStageReason = false;
        this.showFollowUpRow = false;
      } else if (stage === 'Appointment') {
        this.showStageReason = false;
        this.showFollowUpRow = true;
        this.showAppointmentDatePicker = true;
        this.showNextActivityDatePicker = false;
      } else if (stage === 'Callback Required') {
        this.showStageReason = false;
        this.showFollowUpRow = true;
        this.showAppointmentDatePicker = false;
        this.showNextActivityDatePicker = true;
      } else {
        this.showStageReason = true;
        this.showFollowUpRow = true;
        this.showAppointmentDatePicker = false;
        this.showNextActivityDatePicker = true;
      }

      // Stage Reasons
      this.stageReasons = [];
      if (stage === 'Closed Lost') {
        this.stageReasons = [
          'Criteria Not Met',
          'Financially Not Viable',
          'Disliked Premises',
          'Fees Not Acceptable',
          'Location Not Acceptable',
          'Admission Taken Elsewhere',
          'Relocated',
          'Program Not Available',
          'Need Physical School Only',
          'Not Inquired',
          'Invalid/ Wrong Number',
          'Other Reasons',
        ];
      } else if (stage === 'Not Contactable') {
        this.stageReasons = [
          'Ringing',
          'Switched Off',
          'Busy',
          'Call Disconnected',
          'Not Reachable / Out of Coverage',
          'Incoming Calls Barred',
        ];
      }
    }
  }

  loadLatestEnquiryDetails(enquiryDetails: EnquiryDetails[]) {
    const latestDetail = enquiryDetails[enquiryDetails.length - 1];

    console.log('Loading latest detail:', latestDetail);

    if (latestDetail.enquiryFollowUpStage) {
      this.selectedStage = latestDetail.enquiryFollowUpStage;
      this.onFollowUpStageChange(latestDetail.enquiryFollowUpStage);

      setTimeout(() => {
        if (latestDetail.enquiryFollowUpSubstage) {
          this.selectedSubStage = latestDetail.enquiryFollowUpSubstage;
          this.onFollowUpSubStageChange(latestDetail.enquiryFollowUpSubstage);
        }
        console.log('LATEST DETAILLLLLLLL', latestDetail.followUpTime);
        this.enquiryFollowUpForm.patchValue({
          followUpReason: latestDetail.enquiryFollowUpStage || '',
          followUpSubReason: latestDetail.enquiryFollowUpSubstage || '',
          stageReason: latestDetail.enquiryFollowUpReason,
          appointmentDate: this.parseDateFromDB(latestDetail.appointmentVisitDate),
          nextFollowUpDate: this.parseDateFromDB(latestDetail.followUpDate),
          nextFollowUpTime: this.parseTimeFromDB(latestDetail.followUpTime),
          comments: latestDetail.enquiryComment || '',
        });

        console.log('Form values after patch:', this.enquiryFollowUpForm.value);
      }, 100);
    }
  }

  onFollowUpStageSubmit() {
    if (this.enquiryFollowUpForm.invalid) {
      console.log('Form Invalid');
      this.enquiryFollowUpForm.markAllAsTouched();
      return;
    }
    const formValue = this.enquiryFollowUpForm.value;

    const newFollowUpDetail: EnquiryDetails = {
      enquiryId: this.enquiryId,
      enquirerName: this.enquiry?.enquirerName || '',
      enquirerMobile: this.enquiry?.enquirerPhoneNumber || '',
      programName: this.enquiry?.program || '',
      enquiryDate: this.enquiry?.enquiryDate || '',
      gender: this.enquiry?.gender || '',
      studentName: this.enquiry?.name || '',
      enquiryFollowUpStage: formValue.followUpReason,
      enquiryFollowUpSubstage: formValue.followUpSubReason,
      enquiryFollowUpReason: formValue.stageReason,
      activityDate: formValue.activityDate,
      followUpDate: this.formatDateForDB(formValue.nextFollowUpDate),
      followUpTime: this.formatTimeForDB(formValue.nextFollowUpTime),
      appointmentVisitDate: this.formatDateForDB(formValue.appointmentDate),
      enquiryComment: formValue.comments,
    };

    console.log(newFollowUpDetail);

    this.enqService.addFollowUp(this.enquiryId, newFollowUpDetail).subscribe({
      next: (res) => {
        Swal.fire({
          title: 'Success!',
          text: 'Follow Up added successfully',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      },
    });
  }

  // ==================== DATE/TIME CONVERSION FUNCTIONS ====================

  /**
   * Converts Material UI date picker value to dd-MM-yyyy format for database
   * Frontend -> DB
   */
  formatDateForDB(date: string | null | undefined): string {
    if (!date) return '';

    try {
      const dateObj = new Date(date);

      if (isNaN(dateObj.getTime())) return '';

      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (error) {
      console.error('Error formatting date for DB:', error);
      return '';
    }
  }

  /**
   * Converts Material UI time picker value to HH:MM tt format for database
   * Frontend -> DB
   */
  formatTimeForDB(time: Date | null | undefined): string {
    if (!time) return '';

    try {
      if (!(time instanceof Date) || isNaN(time.getTime())) return '';

      let hours = time.getHours();
      const minutes = String(time.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';

      // Convert to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');

      return `${formattedHours}:${minutes} ${ampm}`;
    } catch (error) {
      console.error('Error formatting time for DB:', error);
      return '';
    }
  }

  /**
   * Converts database date format (dd-MM-yyyy) to ISO string for MUI date picker
   * DB -> Frontend
   */
  parseDateFromDB(dateString: string | null | undefined): string | undefined {
    if (!dateString) return undefined;

    try {
      const [dd, mm, yyyy] = dateString.split('-');
      if (!dd || !mm || !yyyy) return undefined;

      const day = Number(dd);
      const month = Number(mm) - 1;
      const year = Number(yyyy);

      const date = new Date(Date.UTC(year, month, day));

      return date.toISOString(); // e.g. 2025-11-09T00:00:00.000Z
    } catch (error) {
      console.error('Error parsing date:', error);
      return undefined;
    }
  }

  /**
   * Converts database time format (HH:MM tt) to Date object for MUI time picker
   * DB -> Frontend
   */
  parseTimeFromDB(timeString: string | null | undefined): Date | undefined {
    if (!timeString) return undefined;

    try {
      timeString = timeString.replace(/[\s\u00A0\u2000-\u200D\u202F\u205F\u3000]+/g, ' ').trim();

      const match = timeString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
      if (!match) return undefined;

      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const period = match[3].toUpperCase();

      if (period === 'AM' && hours === 12) hours = 0;
      if (period === 'PM' && hours !== 12) hours += 12;

      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = now.getMonth();
      const dd = now.getDate();

      // ✅ LOCAL DATE, NOT UTC
      return new Date(yyyy, mm, dd, hours, minutes, 0);
    } catch (error) {
      console.error('Error parsing time:', error);
      return undefined;
    }
  }

  // ==================== DISPLAY FORMATTING FOR TABLE ====================

  /**
   * Method to format date strings for display in table
   */
  formatDateForDisplay(dateString: string | null | undefined): string {
    if (!dateString) return '';

    // If already in dd-MM-yyyy format, return as-is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
      return dateString;
    }

    // Otherwise parse and format
    const isoDate = this.parseDateFromDB(dateString);
    if (!isoDate) return '';

    const date = new Date(isoDate);
    return this.datePipe.transform(date, 'dd-MM-yyyy') || '';
  }

  /**
   * Method to format time strings for display in table
   */
  // formatTimeForDisplay(timeString: string | null | undefined): string {
  //   if (!timeString) return '';

  //   // If already in HH:MM AM/PM format, return as-is
  //   if (timeString.match(/^\d{2}:\d{2}\s*(AM|PM)$/i)) {
  //     return timeString;
  //   }

  //   // Try to parse and format
  //   const timeDate = this.parseTimeFromDB(timeString);
  //   if (!timeDate) return '';

  //   return this.formatTimeForDB(timeDate) || '';
  // }
}
