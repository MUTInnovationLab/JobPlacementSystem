import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmploymentPagePage } from './employment-page.page';

describe('EmploymentPagePage', () => {
  let component: EmploymentPagePage;
  let fixture: ComponentFixture<EmploymentPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmploymentPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
