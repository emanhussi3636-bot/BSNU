import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutionfeesComponent } from './tutionfees.component';

describe('TutionfeesComponent', () => {
  let component: TutionfeesComponent;
  let fixture: ComponentFixture<TutionfeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutionfeesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutionfeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
