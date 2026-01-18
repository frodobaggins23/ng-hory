import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnlockGalleryComponent } from './unlock-gallery.component';

describe('UnlockGalleryComponent', () => {
  let component: UnlockGalleryComponent;
  let fixture: ComponentFixture<UnlockGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnlockGalleryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnlockGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
