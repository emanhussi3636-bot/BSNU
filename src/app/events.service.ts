import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, retry, throwError, timer } from 'rxjs';
import { environment } from './environment/environment';

export interface EventImage {
  id: number;
  imageUrl: string | null;
  displayOrder: number;
  isMain: boolean;
}

export interface EventRecord {
  id: number;
  title: string | null;
  description: string | null;
  detail: string | null;
  startDate: string | null;
  endDate: string | null;
  programsId: number;
  location: string | null;
  isPublished: boolean;
  images: EventImage[] | null;
}

export interface EventProgramGroup {
  programId: number;
  programName?: string;
  events: EventRecord[];
}

export interface EventApiCollection {
  value: EventRecord[] | EventProgramGroup[];
  Count?: number;
}

export type EventApiResponse = EventRecord[] | EventApiCollection;

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private readonly apiUrl = `${environment.baseUrl}/api/Events`;
  private readonly httpClient = inject(HttpClient);

  getEvents(language: 'en' | 'ar' = 'en'): Observable<EventRecord[]> {
    const params = new HttpParams().set('lang', language);
    return this.httpClient.get<EventApiResponse>(this.apiUrl, { params }).pipe(
      retry({ count: 2, delay: this.retryDelay }),
      map((response) => this.normalizeEvents(response))
    );
  }

  getEventById(id: number | string, language: 'en' | 'ar' = 'en'): Observable<EventRecord> {
    const params = new HttpParams().set('lang', language);
    return this.httpClient.get<EventRecord>(`${this.apiUrl}/${id}`, { params }).pipe(
      retry({ count: 2, delay: this.retryDelay })
    );
  }

  private readonly retryDelay = (error: HttpErrorResponse, retryCount: number) => {
    const transientStatuses = [0, 500, 502, 503, 504];
    return transientStatuses.includes(error.status)
      ? timer(retryCount * 500)
      : throwError(() => error);
  };

  private normalizeEvents(response: EventApiResponse): EventRecord[] {
    const records = Array.isArray(response) ? response : response.value ?? [];
    if (records.length === 0) {
      return [];
    }

    if ('events' in records[0]) {
      return (records as EventProgramGroup[]).flatMap((group) =>
        group.events.map((event) => ({ ...event, programsId: event.programsId ?? group.programId }))
      );
    }

    return records as EventRecord[];
  }
}
