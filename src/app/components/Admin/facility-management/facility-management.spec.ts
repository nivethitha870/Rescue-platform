import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityManagementComponent } from './facility-management';

describe('FacilityManagementComponent', () => {
  let component: FacilityManagementComponent;
  let fixture: ComponentFixture<FacilityManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacilityManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacilityManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
