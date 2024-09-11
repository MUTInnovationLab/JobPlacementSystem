import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GaValidationPage } from './ga-validation.page';

describe('GaValidationPage', () => {
  let component: GaValidationPage;
  let fixture: ComponentFixture<GaValidationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GaValidationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
