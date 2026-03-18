import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseMapComponent } from './case-map';

describe('CaseMapComponent', () => {
  let component: CaseMapComponent;
  let fixture: ComponentFixture<CaseMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CaseMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CaseMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
