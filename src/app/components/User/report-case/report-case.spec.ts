import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportCaseComponent } from './report-case';

describe('ReportCaseComponent', () => {
  let component: ReportCaseComponent;
  let fixture: ComponentFixture<ReportCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportCaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportCaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
