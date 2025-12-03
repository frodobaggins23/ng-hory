import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MountainDialogComponent } from './mountain-dialog.component';

describe('MountainDialogComponent', () => {
  let component: MountainDialogComponent;
  let fixture: ComponentFixture<MountainDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MountainDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MountainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
