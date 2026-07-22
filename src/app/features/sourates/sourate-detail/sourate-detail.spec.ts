import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourateDetail } from './sourate-detail';

describe('SourateDetail', () => {
  let component: SourateDetail;
  let fixture: ComponentFixture<SourateDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourateDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SourateDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
