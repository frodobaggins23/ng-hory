import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial state with showMap false and introScrolled false', () => {
    expect(component.showMap).toBe(false);
    expect(component.introScrolled).toBe(false);
  });

  it('should set introScrolled to true when onIntroScrolled is called', () => {
    component.onIntroScrolled();
    expect(component.introScrolled).toBe(true);
  });

  it('should show map after transition delay when intro scrolled', fakeAsync(() => {
    component.onIntroScrolled();
    expect(component.showMap).toBe(false);

    tick(1200);

    expect(component.showMap).toBe(true);
  }));

  it('should add scrolled class to host when introScrolled is true', () => {
    const hostElement = fixture.nativeElement;
    expect(hostElement.classList.contains('scrolled')).toBe(false);

    component.onIntroScrolled();
    fixture.detectChanges();

    expect(hostElement.classList.contains('scrolled')).toBe(true);
  });

  it('should render intro-page component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-intro-page')).toBeTruthy();
  });

  it('should not render leaflet-map initially', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-leaflet-map')).toBeFalsy();
  });

  it('should render leaflet-map after showMap becomes true', fakeAsync(() => {
    component.onIntroScrolled();
    tick(1200);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-leaflet-map')).toBeTruthy();
  }));
});
