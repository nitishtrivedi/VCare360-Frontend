import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Daycarelayout } from './daycarelayout';

describe('Daycarelayout', () => {
  let component: Daycarelayout;
  let fixture: ComponentFixture<Daycarelayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Daycarelayout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Daycarelayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
