import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirdList } from './bird-list';

describe('BirdList', () => {
  let component: BirdList;
  let fixture: ComponentFixture<BirdList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BirdList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirdList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
