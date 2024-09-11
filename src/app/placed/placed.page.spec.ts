import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlacedPage } from './placed.page';

describe('PlacedPage', () => {
  let component: PlacedPage;
  let fixture: ComponentFixture<PlacedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
