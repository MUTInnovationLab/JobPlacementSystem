import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecommendedPage } from './recommended.page';

describe('RecommendedPage', () => {
  let component: RecommendedPage;
  let fixture: ComponentFixture<RecommendedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
