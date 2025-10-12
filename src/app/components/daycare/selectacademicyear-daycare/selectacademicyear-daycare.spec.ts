import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectacademicyearDaycare } from './selectacademicyear-daycare';

describe('SelectacademicyearDaycare', () => {
  let component: SelectacademicyearDaycare;
  let fixture: ComponentFixture<SelectacademicyearDaycare>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectacademicyearDaycare]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectacademicyearDaycare);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
