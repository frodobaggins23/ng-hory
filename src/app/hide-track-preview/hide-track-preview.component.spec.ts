import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HideTrackPreviewComponent } from './hide-track-preview.component';

describe('HideTrackPreviewComponent', () => {
  let component: HideTrackPreviewComponent;
  let fixture: ComponentFixture<HideTrackPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HideTrackPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HideTrackPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
