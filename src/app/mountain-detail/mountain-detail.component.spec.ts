import { ComponentFixture, TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import { MountainDetailComponent } from './mountain-detail.component';

// Register Czech locale for DatePipe
registerLocaleData(localeCs);

describe('MountainDetailComponent', () => {
  let component: MountainDetailComponent;
  let fixture: ComponentFixture<MountainDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MountainDetailComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MountainDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
