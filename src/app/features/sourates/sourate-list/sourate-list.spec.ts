import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourateList } from './sourate-list';

describe('SourateList', () => {
  let component: SourateList;
  let fixture: ComponentFixture<SourateList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourateList],
    }).compileComponents();

    fixture = TestBed.createComponent(SourateList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
