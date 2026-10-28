import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
  });

  it('renders manager and dean profile links', () => {
    expect(fixture.nativeElement.querySelector('a[href="/staff/dean/1"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/staff/dean/2"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('a[href="/staff/dean/3"]')).not.toBeNull();
  });
});
