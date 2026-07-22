import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Telechargements } from './telechargements';

describe('Telechargements', () => {
  let component: Telechargements;
  let fixture: ComponentFixture<Telechargements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Telechargements],
    }).compileComponents();

    fixture = TestBed.createComponent(Telechargements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
