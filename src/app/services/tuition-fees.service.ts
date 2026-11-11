import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, map, retry, throwError, timer } from 'rxjs';
import { environment } from '../environment/environment';

export type TuitionFeesLanguage = 'en' | 'ar';

export interface TuitionFeeLevel {
  id: number;
  levelNumber: number;
  feeAmount: number | null;
  academicYear: string | null;
}

export interface TuitionFeeRecord {
  id: number;
  programsId: number;
  programNameEn: string | null;
  programNameAr: string | null;
  facultyNameEn: string | null;
  facultyNameAr: string | null;
  sectorNameEn: string | null;
  sectorNameAr: string | null;
  displayOrder: number;
  levels: TuitionFeeLevel[] | null;
}

export interface TuitionFeesApiCollection {
  value: TuitionFeeRecord[];
  Count?: number;
}

export type TuitionFeesApiResponse = TuitionFeeRecord[] | TuitionFeesApiCollection;

@Injectable({
  providedIn: 'root'
})
export class TuitionFeesService {
  private readonly apiUrl = isPlatformBrowser(inject(PLATFORM_ID))
    ? '/api/TuitionFees'
    : `${environment.baseUrl}/api/TuitionFees`;
  private readonly httpClient = inject(HttpClient);

  getTuitionFees(language: TuitionFeesLanguage): Observable<TuitionFeeRecord[]> {
    const params = new HttpParams().set('lang', language);
    return this.httpClient.get<TuitionFeesApiResponse>(this.apiUrl, { params }).pipe(
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
