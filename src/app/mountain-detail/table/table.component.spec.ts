import { ComponentFixture, TestBed } from '@angular/core/testing';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import { TableComponent } from './table.component';

// Register Czech locale for DatePipe
registerLocaleData(localeCs);

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    component.mountainName = 'Test Mountain';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with no expanded column', () => {
    expect(component.expandedColumn).toBeNull();
  });

  it('should have correct columns configuration', () => {
    expect(component.columns.length).toBe(7);
    expect(component.columns[0].name).toBe('date');
    expect(component.columns[6].isLast).toBe(true);
  });

  it('should toggle column expansion', () => {
    component.expandColumn(1);
    expect(component.expandedColumn).toBe(1);

    component.expandColumn(1);
    expect(component.expandedColumn).toBeNull();
  });

  it('should switch to different column when expanding another', () => {
    component.expandColumn(1);
    expect(component.expandedColumn).toBe(1);

    component.expandColumn(2);
    expect(component.expandedColumn).toBe(2);
  });
});
