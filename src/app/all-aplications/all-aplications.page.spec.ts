import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AllAplicationsPage } from './all-aplications.page';

describe('AllAplicationsPage', () => {
  let component: AllAplicationsPage;
  let fixture: ComponentFixture<AllAplicationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AllAplicationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
