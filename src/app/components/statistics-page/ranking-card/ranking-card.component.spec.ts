import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingCardComponent } from './ranking-card.component';

describe('RankingCardComponent', () => {
  let component: RankingCardComponent;
  let fixture: ComponentFixture<RankingCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RankingCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
