import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Addenquiry } from './addenquiry';

describe('Addenquiry', () => {
  let component: Addenquiry;
  let fixture: ComponentFixture<Addenquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Addenquiry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Addenquiry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
