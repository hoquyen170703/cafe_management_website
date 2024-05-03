import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgottedPasswordComponent } from './forgotted-password.component';

describe('ForgottedPasswordComponent', () => {
  let component: ForgottedPasswordComponent;
  let fixture: ComponentFixture<ForgottedPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgottedPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgottedPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
