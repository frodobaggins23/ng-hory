import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeElevationChartComponent } from './cumulative-elevation-chart.component';

describe('CumulativeElevationChartComponent', () => {
  let component: CumulativeElevationChartComponent;
  let fixture: ComponentFixture<CumulativeElevationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CumulativeElevationChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CumulativeElevationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
