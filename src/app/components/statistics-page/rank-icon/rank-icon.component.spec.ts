import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankIconComponent } from './rank-icon.component';

describe('RankIconComponent', () => {
  let component: RankIconComponent;
  let fixture: ComponentFixture<RankIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankIconComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RankIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
