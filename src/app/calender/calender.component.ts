import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, catchError, of, switchMap } from 'rxjs';
import { LanguageService } from '../services/language.service';
import {
  SemesterCalendarEvent,
  SemesterCalendarLanguage,
  SemesterCalendarRecord,
  SemesterCalendarService
} from '../services/semester-calendar.service';

interface CalendarView {
  id: number;
  title: string;
  headOfSectorTitle: string;
  headOfSectorName: string;
  events: SemesterCalendarEvent[];
}

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent implements OnInit, OnDestroy {
  calendars: CalendarView[] = [];
  isLoading = true;
  loadError = false;
  private currentLanguage: SemesterCalendarLanguage = 'en';
  private readonly subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private readonly semesterCalendarService: SemesterCalendarService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$.pipe(
        switchMap((language) => {
          this.currentLanguage = language;
          this.isLoading = true;
          this.loadError = false;
          this.calendars = [];

          return this.semesterCalendarService.getCalendars(language).pipe(
            catchError((error: unknown) => {
              console.error('Failed to load semester calendars.', error);
              this.loadError = true;
              this.isLoading = false;
              return of([]);
            })
          );
        })
      ).subscribe((records) => {
        this.calendars = records.map((record) => this.toCalendarView(record));
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getEventName(event: SemesterCalendarEvent): string {
    return this.localizedValue(event.eventName, event.eventNameEn, event.eventNameAr);
  }

  getEventDate(event: SemesterCalendarEvent): string {
    const localizedDate = this.currentLanguage === 'ar' ? event.dateTextAr : event.dateTextEn;
    if (localizedDate || (this.currentLanguage === 'en' && event.dateText)) {
      return localizedDate || event.dateText || '';
    }

    const startDate = this.formatDate(event.startDate);
    const endDate = this.formatDate(event.endDate);
    if (startDate && endDate) {
      return startDate === endDate ? startDate : `${startDate} – ${endDate}`;
    }

    return event.dateText || startDate || endDate || '';
  }

  private toCalendarView(record: SemesterCalendarRecord): CalendarView {
    const term = this.localizedValue(record.termName, record.termNameEn, record.termNameAr);
    const title = this.localizedValue(record.title, record.titleEn, record.titleAr);

    return {
      id: record.id,
      title: title || [term, record.academicYear].filter(Boolean).join(' '),
      headOfSectorTitle: this.localizedValue(
        record.headOfSectorTitle,
        record.headOfSectorTitleEn,
        record.headOfSectorTitleAr
      ),
      headOfSectorName: this.localizedValue(
        record.headOfSectorName,
        record.headOfSectorNameEn,
        record.headOfSectorNameAr
      ),
      events: [...(record.events ?? [])].sort(
        (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0)
      )
    };
  }

  private localizedValue(
    value: string | null | undefined,
    english: string | null | undefined,
    arabic: string | null | undefined
  ): string {
    return (this.currentLanguage === 'ar' ? arabic : english) || value || english || arabic || '';
  }

  private formatDate(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat(this.currentLanguage === 'ar' ? 'ar-EG' : 'en-EG', {
      weekday: 'short',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    }).format(date);
  }
}
