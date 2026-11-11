import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, map, retry, throwError, timer } from 'rxjs';
import { environment } from '../environment/environment';

export type SemesterCalendarLanguage = 'en' | 'ar';

export interface SemesterCalendarEvent {
  id: number;
  eventName?: string | null;
  eventNameEn?: string | null;
  eventNameAr?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder?: number;
  dateText?: string | null;
  dateTextEn?: string | null;
  dateTextAr?: string | null;
}

export interface SemesterCalendarRecord {
  id: number;
  title?: string | null;
  titleEn?: string | null;
  titleAr?: string | null;
  academicYear?: string | null;
  termName?: string | null;
  termNameEn?: string | null;
  termNameAr?: string | null;
  headOfSectorTitle?: string | null;
  headOfSectorTitleEn?: string | null;
  headOfSectorTitleAr?: string | null;
  headOfSectorName?: string | null;
  headOfSectorNameEn?: string | null;
  headOfSectorNameAr?: string | null;
  events?: SemesterCalendarEvent[] | null;
}

export interface SemesterCalendarApiCollection {
  value: SemesterCalendarRecord[];
  Count?: number;
}

export type SemesterCalendarApiResponse =
  | SemesterCalendarRecord[]
  | SemesterCalendarApiCollection;

@Injectable({
  providedIn: 'root'
})
export class SemesterCalendarService {
  private readonly apiUrl = isPlatformBrowser(inject(PLATFORM_ID))
    ? '/api/SemesterCalendar'
    : `${environment.baseUrl}/api/SemesterCalendar`;
  private readonly httpClient = inject(HttpClient);

  getCalendars(language: SemesterCalendarLanguage): Observable<SemesterCalendarRecord[]> {
    const params = new HttpParams().set('lang', language);
    return this.httpClient.get<SemesterCalendarApiResponse>(this.apiUrl, { params }).pipe(
      retry({ count: 2, delay: this.retryDelay }),
      map((response) => Array.isArray(response) ? response : response.value ?? [])
    );
  }

  private readonly retryDelay = (error: HttpErrorResponse, retryCount: number) => {
    const transientStatuses = [0, 500, 502, 503, 504];
    return transientStatuses.includes(error.status)
      ? timer(retryCount * 500)
      : throwError(() => error);
  };
}
