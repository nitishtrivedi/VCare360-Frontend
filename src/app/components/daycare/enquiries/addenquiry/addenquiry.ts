import { formatDate } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addenquiry',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './addenquiry.html',
  styleUrl: './addenquiry.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Addenquiry implements OnInit {
  enquiryForm: FormGroup;
  enquiryDate: string = '';
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  ngOnInit(): void {
    var today = new Date();
    this.enquiryDate = formatDate(today, 'dd-MM-yyyy', 'en-US');
    console.log(this.enquiryDate);
  }
  /**
   *
   */
  constructor() {
    this.enquiryForm = this.fb.group({
      academicYear: [''],
      enquiryDateField: [this.enquiryDate],
    });
  }
}
