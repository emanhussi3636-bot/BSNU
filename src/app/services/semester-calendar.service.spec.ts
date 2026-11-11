import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SemesterCalendarService } from './semester-calendar.service';

describe('SemesterCalendarService', () => {
  let service: SemesterCalendarService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SemesterCalendarService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('requests and unwraps semester calendars in the requested language', () => {
    service.getCalendars('ar').subscribe((calendars) => {
      expect(calendars.length).toBe(1);
      expect(calendars[0].titleAr).toBe('تقويم الفصل الدراسي');
      expect(calendars[0].events?.[0].eventNameAr).toBe('التسجيل');
    });

    httpTestingController.expectOne('/api/SemesterCalendar?lang=ar').flush({
      value: [{
        id: 2,
        title: 'Semester Calendar',
        titleAr: 'تقويم الفصل الدراسي',
        events: [{
          id: 1,
          eventName: 'Registration',
          eventNameAr: 'التسجيل',
          displayOrder: 1
        }]
      }],
      Count: 1
    });
  });
});
