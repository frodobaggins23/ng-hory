import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageOverlayComponent } from './image-overlay.component';

describe('ImageOverlayComponent', () => {
  let component: ImageOverlayComponent;
  let fixture: ComponentFixture<ImageOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeOverlay when overlay is clicked', () => {
    spyOn(component.closeOverlay, 'emit');
    component.closeOverlay.emit();
    expect(component.closeOverlay.emit).toHaveBeenCalled();
  });

  it('should emit closeOverlay when escape key is pressed', () => {
    spyOn(component.closeOverlay, 'emit');
    component.onEscapeKey();
    expect(component.closeOverlay.emit).toHaveBeenCalled();
  });
});
