import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectacademicyearPreschool } from './selectacademicyear-preschool';

describe('SelectacademicyearPreschool', () => {
  let component: SelectacademicyearPreschool;
  let fixture: ComponentFixture<SelectacademicyearPreschool>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectacademicyearPreschool]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectacademicyearPreschool);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
