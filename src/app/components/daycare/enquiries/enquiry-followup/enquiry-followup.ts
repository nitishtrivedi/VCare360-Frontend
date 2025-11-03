import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import {
  Enquiry,
  EnquiryDetails,
  Enquiryservice,
} from '../../../../services/daycare/enquiryservice';
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
import { DateUtilsService } from '../../../../services/date-utils-service';

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
  private datePipe = new DatePipe('en-IN');
  private dateUtils = inject(DateUtilsService);
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
    const datePipe = new DatePipe('en-IN');
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
        this.enquiryFollowUpForm.patchValue({
          followUpReason: latestDetail.enquiryFollowUpStage || '',
          followUpSubReason: latestDetail.enquiryFollowUpSubstage || '',
          stageReason: latestDetail.enquiryFollowUpReason,
          appointmentDate: this.dateUtils.parseDateFromDB(latestDetail.appointmentVisitDate),
          nextFollowUpDate: this.dateUtils.parseDateFromDB(latestDetail.followUpDate),
          nextFollowUpTime: this.dateUtils.parseTimeFromDB(latestDetail.followUpTime),
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
      followUpDate: this.dateUtils.formatDateForDB(formValue.nextFollowUpDate),
      followUpTime: this.dateUtils.formatTimeForDB(formValue.nextFollowUpTime),
      appointmentVisitDate: this.dateUtils.formatDateForDB(formValue.appointmentDate),
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
}
