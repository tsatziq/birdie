import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSpecies } from './add-species';

describe('AddSpecies', () => {
  let component: AddSpecies;
  let fixture: ComponentFixture<AddSpecies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSpecies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSpecies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
