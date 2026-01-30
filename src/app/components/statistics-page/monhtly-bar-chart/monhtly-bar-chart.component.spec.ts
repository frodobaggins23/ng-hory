import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonhtlyBarChartComponent } from './monhtly-bar-chart.component';

describe('MonhtlyBarChartComponent', () => {
  let component: MonhtlyBarChartComponent;
  let fixture: ComponentFixture<MonhtlyBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonhtlyBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MonhtlyBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
