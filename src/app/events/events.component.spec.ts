import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { EventRecord, EventsService } from '../events.service';
import { LanguageService } from '../services/language.service';
import { EventsComponent } from './events.component';

describe('EventsComponent', () => {
  let fixture: ComponentFixture<EventsComponent>;
  let language$: BehaviorSubject<'en' | 'ar'>;
  let eventsService: jasmine.SpyObj<EventsService>;

  beforeEach(async () => {
    language$ = new BehaviorSubject<'en' | 'ar'>('en');
    eventsService = jasmine.createSpyObj<EventsService>('EventsService', ['getEvents']);
    eventsService.getEvents.and.callFake((language = 'en') => of([
      {
        id: 18,
        title: language === 'ar' ? 'فعالية باللغة العربية' : 'English event',
        description: null,
        detail: null,
        startDate: '2026-11-01T00:00:00',
        endDate: null,
        programsId: 4,
        location: null,
        isPublished: true,
        images: []
      } satisfies EventRecord
    ]));

    await TestBed.configureTestingModule({
      imports: [EventsComponent],
      providers: [
        provideRouter([]),
        { provide: EventsService, useValue: eventsService },
        {
          provide: LanguageService,
          useValue: {
            currentLang$: language$.asObservable(),
            translate: (key: string) => key
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    fixture.detectChanges();
  });

  it('requests and displays events in the selected language', () => {
    language$.next('ar');
    fixture.detectChanges();

    expect(eventsService.getEvents).toHaveBeenCalledWith('ar');
    expect(fixture.nativeElement.textContent).toContain('فعالية باللغة العربية');
    expect(fixture.nativeElement.textContent).not.toContain('English event');
  });
});
