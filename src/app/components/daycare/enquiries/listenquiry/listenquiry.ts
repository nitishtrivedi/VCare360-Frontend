import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Enquiry, Enquiryservice } from '../../../../services/daycare/enquiryservice';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-listenquiry',
  imports: [
    MatButtonModule,
    MatTableModule,
    DatePipe,
    MatPaginator,
    MatIconModule,
    MatTooltipModule,
    RouterLink,
    MatCard,
  ],
  templateUrl: './listenquiry.html',
  styleUrl: './listenquiry.css',
  standalone: true,
})
export class Listenquiry implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private router = inject(Router);
  private enquiryService = inject(Enquiryservice);
  interestedEnquiries: number = 0;
  notInterestedEnquiries: number = 0;
  needFollowUpEnquiries: number = 0;
  totalEnquiries: number = 0;
  tableDisplayedColumns: string[] = [
    'count',
    'name',
    'enquirerName',
    'enquirerPhoneNumber',
    'enquiryFollowUpSubstage',
    'followUpDate',
    'lastContacted',
    'actions',
  ];

  enquiriesData: Enquiry[] = [];
  allEnquiriesBackup: Enquiry[] = [];
  dataSource = new MatTableDataSource<Enquiry>(this.enquiriesData);

  ngOnInit(): void {
    this.loadAllEnquiries();
  }

  addEnquiry() {
    this.router.navigate(['/daycare/enquiries/add']);
  }

  loadAllEnquiries() {
    this.enquiryService.getAllEnquiries().subscribe({
      next: (res) => {
        this.enquiriesData = res;
        this.allEnquiriesBackup = res;
        this.totalEnquiries = res.length;
        // Reset counts
        this.interestedEnquiries = 0;
        this.notInterestedEnquiries = 0;
        this.needFollowUpEnquiries = 0;

        // Calculate counts based on latest follow-up stage
        res.forEach((enquiry) => {
          const details = enquiry.enquiryDetails;
          if (details && details.length > 0) {
            const latest = details[details.length - 1];

            switch (latest.enquiryFollowUpStage) {
              case 'Interested':
                this.interestedEnquiries++;
                break;

              case 'Not Interested':
                this.notInterestedEnquiries++;
                break;

              case 'Need Follow Up':
                this.needFollowUpEnquiries++;
                break;
            }
          }
        });
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  get interestedEnqProgressValue() {
    return (this.interestedEnquiries / this.totalEnquiries) * 100;
  }
  get notInterestedEnqProgressValue() {
    return (this.notInterestedEnquiries / this.totalEnquiries) * 100;
  }
  get needFollowUpEnqProgressValue() {
    return (this.needFollowUpEnquiries / this.totalEnquiries) * 100;
  }
  get totalEnqProgressValue() {
    const maxEnquiries = 50; //Change if needed
    return (this.totalEnquiries / maxEnquiries) * 100;
  }
  //ADDED: Filter by stage
  filterEnquiriesByStage(stage: string) {
    const filtered = this.allEnquiriesBackup.filter((enq) => {
      const details = enq.enquiryDetails;
      if (!details || details.length === 0) return false;

      const latest = details[details.length - 1];
      return latest.enquiryFollowUpStage === stage;
    });

    this.dataSource.data = filtered;

    // Reset paginator to first page
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  // ADDED: Reset to all enquiries
  resetFilter() {
    this.dataSource.data = this.allEnquiriesBackup;

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}
