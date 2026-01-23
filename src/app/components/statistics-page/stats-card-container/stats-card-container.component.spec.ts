import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsCardContainerComponent } from './stats-card-container.component';

describe('StatsCardContainerComponent', () => {
  let component: StatsCardContainerComponent;
  let fixture: ComponentFixture<StatsCardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsCardContainerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsCardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
