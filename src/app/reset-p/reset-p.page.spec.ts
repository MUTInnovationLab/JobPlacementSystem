import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPPage } from './reset-p.page';

describe('ResetPPage', () => {
  let component: ResetPPage;
  let fixture: ComponentFixture<ResetPPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
