import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnquiryFollowup } from './enquiry-followup';

describe('EnquiryFollowup', () => {
  let component: EnquiryFollowup;
  let fixture: ComponentFixture<EnquiryFollowup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnquiryFollowup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnquiryFollowup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
