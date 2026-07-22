import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavorisList } from './favoris-list';

describe('FavorisList', () => {
  let component: FavorisList;
  let fixture: ComponentFixture<FavorisList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavorisList],
    }).compileComponents();

    fixture = TestBed.createComponent(FavorisList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
