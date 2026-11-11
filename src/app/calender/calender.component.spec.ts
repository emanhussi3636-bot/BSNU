import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageService } from '../services/language.service';
import { CalenderComponent } from './calender.component';

describe('CalenderComponent', () => {
  let fixture: ComponentFixture<CalenderComponent>;
  let httpTestingController: HttpTestingController;
  let languageService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalenderComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(CalenderComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads localized calendars and events when the language changes', () => {
    fixture.detectChanges();
    httpTestingController.expectOne('/api/SemesterCalendar?lang=en').flush({
      value: [{
        id: 2,
        title: 'Semester Calendar',
        titleAr: 'تقويم الفصل الدراسي',
        academicYear: '2026-2027',
        termName: 'Second Term',
        termNameAr: 'الفصل الدراسي الثاني',
        headOfSectorTitle: 'Head of Student Sector',
        headOfSectorTitleAr: 'رئيس قطاع الطلاب',
        headOfSectorName: 'Prof. Basem',
        headOfSectorNameAr: 'أ.د. باسم',
        events: [
          {
            id: 2,
            eventName: 'Final exams',
            eventNameAr: 'الاختبارات النهائية',
            startDate: '2026-11-18T00:00:00',
            endDate: '2026-11-27T00:00:00',
            displayOrder: 2,
            dateText: 'English date'
          },
          {
            id: 1,
            eventName: 'Registration',
            eventNameAr: 'التسجيل',
            startDate: '2026-11-11T00:00:00',
            endDate: '2026-11-11T00:00:00',
            displayOrder: 1,
            dateText: 'Wed 11/11/2026'
          }
        ]
      }],
      Count: 1
    });
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const element = fixture.nativeElement as HTMLElement;
    expect(component.calendars.length).toBe(1);
    expect(component.calendars[0].events[0].eventName).toBe('Registration');
    expect(element.textContent).toContain('Semester Calendar');
    expect(element.textContent).toContain('Registration');
    expect(element.textContent).toContain('English date');

    languageService.setLanguage('ar');
    fixture.detectChanges();
    httpTestingController.expectOne('/api/SemesterCalendar?lang=ar').flush({
      value: [{
        id: 2,
        title: 'Semester Calendar',
        titleAr: 'تقويم الفصل الدراسي',
        academicYear: '2026-2027',
        termName: 'Second Term',
        termNameAr: 'الفصل الدراسي الثاني',
        headOfSectorTitle: 'Head of Student Sector',
        headOfSectorTitleAr: 'رئيس قطاع الطلاب',
        headOfSectorName: 'Prof. Basem',
        headOfSectorNameAr: 'أ.د. باسم',
        events: [{
          id: 1,
          eventName: 'Registration',
          eventNameAr: 'التسجيل',
          startDate: '2026-11-11T00:00:00',
          endDate: '2026-11-11T00:00:00',
          displayOrder: 1,
          dateText: 'Wed 11/11/2026'
        }]
      }],
      Count: 1
    });
    fixture.detectChanges();

    expect(element.textContent).toContain('تقويم الفصل الدراسي');
    expect(element.textContent).toContain('التسجيل');
    expect(element.textContent).toContain('رئيس قطاع الطلاب');
    expect(element.textContent).not.toContain('Wed 11/11/2026');
  });
});
