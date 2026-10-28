import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventsService } from './events.service';
import { environment } from './environment/environment';

describe('EventsService', () => {
  let service: EventsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(EventsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads event details by ID and language', () => {
    service.getEventById(24, 'ar').subscribe((event) => {
      expect(event.id).toBe(24);
      expect(event.title).toBe('University event');
    });

    httpTestingController
      .expectOne(`${environment.baseUrl}/api/Events/24?lang=ar`)
      .flush({
        id: 24,
        title: 'University event',
        description: 'Description',
        detail: 'Details',
        startDate: null,
        endDate: null,
        programsId: 3,
        location: 'Campus',
        isPublished: true,
        images: []
      });
  });

  it('loads events using the requested language', () => {
    service.getEvents('ar').subscribe((events) => {
      expect(events.length).toBe(1);
      expect(events[0].title).toBe('University event');
    });

    httpTestingController.expectOne(`${environment.baseUrl}/api/Events?lang=ar`).flush([
      {
        id: 24,
        title: 'University event',
        description: 'Description',
        detail: 'Details',
        startDate: '2026-10-20T00:00:00',
        endDate: null,
        programsId: 3,
        location: 'Campus',
        isPublished: true,
        images: []
      }
    ]);
  });

  it('flattens events from the grouped API response', () => {
    service.getEvents('en').subscribe((events) => {
      expect(events.length).toBe(1);
      expect(events[0].programsId).toBe(4);
      expect(events[0].title).toBe('Basketball Championship');
    });

    httpTestingController.expectOne(`${environment.baseUrl}/api/Events?lang=en`).flush({
      value: [
        {
          programId: 4,
          programName: 'Physical Therapy',
          events: [
            {
              id: 1,
              title: 'Basketball Championship',
              description: 'Description',
              detail: 'Details',
              startDate: null,
              endDate: null,
              programsId: 4,
              location: 'Campus',
              isPublished: true,
              images: []
            }
          ]
        }
      ],
      Count: 1
    });
  });
});
