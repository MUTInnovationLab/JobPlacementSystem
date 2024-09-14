import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidateDocsModalPage } from './validate-docs-modal.page';

describe('ValidateDocsModalPage', () => {
  let component: ValidateDocsModalPage;
  let fixture: ComponentFixture<ValidateDocsModalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateDocsModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
