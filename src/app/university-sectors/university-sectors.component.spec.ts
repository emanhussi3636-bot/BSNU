import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniversitySectorsComponent } from './university-sectors.component';

describe('UniversitySectorsComponent', () => {
  let component: UniversitySectorsComponent;
  let fixture: ComponentFixture<UniversitySectorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversitySectorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UniversitySectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
