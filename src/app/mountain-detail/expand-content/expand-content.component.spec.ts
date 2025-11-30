import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpandContentComponent } from './expand-content.component';
import { Climb } from '../../../data/types';

describe('ExpandContentComponent', () => {
  let component: ExpandContentComponent;
  let fixture: ComponentFixture<ExpandContentComponent>;

  const mockClimb: Climb = {
    id: 1,
    date: '2024-01-15',
    description: 'Test climb',
    duration: 3600,
    distance: 5000,
    heartRate: 140,
    elevationGain: 300,
    imgs: ['test1.jpg', 'test2.jpg'],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandContentComponent);
    component = fixture.componentInstance;
    // Set required inputs before detectChanges
    component.content = mockClimb;
    component.mountainName = 'Test Mountain';
    component.imgFolder = 'test-folder';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return images from content', () => {
    expect(component.images).toEqual(['test1.jpg', 'test2.jpg']);
  });

  it('should correctly identify when it has images', () => {
    expect(component.hasImages).toBe(true);
  });

  it('should correctly identify when it has no images', () => {
    component.content = { ...mockClimb, imgs: [] };
    expect(component.hasImages).toBe(false);
  });

  it('should correctly identify when it has a track', () => {
    component.content = { ...mockClimb, track: { type: 'Feature' } as GeoJSON.GeoJsonObject };
    expect(component.hasTrack).toBe(true);
  });

  it('should correctly identify when it has no track', () => {
    expect(component.hasTrack).toBe(false);
  });
});
