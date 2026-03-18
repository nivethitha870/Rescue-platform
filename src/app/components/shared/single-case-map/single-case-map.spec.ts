import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCaseMap } from './single-case-map';

describe('SingleCaseMap', () => {
  let component: SingleCaseMap;
  let fixture: ComponentFixture<SingleCaseMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleCaseMap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleCaseMap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
