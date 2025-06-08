import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageOverlayComponent } from './image-overlay.component';

describe('ImageOverlayComponent', () => {
  let component: ImageOverlayComponent;
  let fixture: ComponentFixture<ImageOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeOverlay when onOverlayClick is called', () => {
    spyOn(component.closeOverlay, 'emit');
    component.onOverlayClick();
    expect(component.closeOverlay.emit).toHaveBeenCalled();
  });

  it('should emit closeOverlay when escape key is pressed', () => {
    spyOn(component.closeOverlay, 'emit');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onEscapeKey(event);
    expect(component.closeOverlay.emit).toHaveBeenCalled();
  });
});