import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpandContentComponent } from './expand-content.component';

describe('ExpandContentComponent', () => {
  let component: ExpandContentComponent;
  let fixture: ComponentFixture<ExpandContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpandContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
