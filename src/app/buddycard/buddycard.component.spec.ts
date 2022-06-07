import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuddycardComponent } from './buddycard.component';

describe('BuddycardComponent', () => {
  let component: BuddycardComponent;
  let fixture: ComponentFixture<BuddycardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuddycardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuddycardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
