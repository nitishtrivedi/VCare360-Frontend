import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editenquiry } from './editenquiry';

describe('Editenquiry', () => {
  let component: Editenquiry;
  let fixture: ComponentFixture<Editenquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editenquiry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editenquiry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
