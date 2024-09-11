import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WilPagePage } from './wil-page.page';

describe('WilPagePage', () => {
  let component: WilPagePage;
  let fixture: ComponentFixture<WilPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WilPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
