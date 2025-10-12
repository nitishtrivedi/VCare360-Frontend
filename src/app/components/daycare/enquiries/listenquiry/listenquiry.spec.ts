import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listenquiry } from './listenquiry';

describe('Listenquiry', () => {
  let component: Listenquiry;
  let fixture: ComponentFixture<Listenquiry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Listenquiry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listenquiry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
