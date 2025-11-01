import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Enquiry, Enquiryservice } from '../../../../services/daycare/enquiryservice';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
  templateUrl: './listenquiry.html',
  styleUrl: './listenquiry.css',
  standalone: true,
})
export class Listenquiry implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private router = inject(Router);
  private enquiryService = inject(Enquiryservice);
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
        console.log(res);
        this.enquiriesData = res;
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
