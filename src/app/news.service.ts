import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, retry, throwError, timer } from 'rxjs';
import { environment } from './environment/environment';

export interface NewsRecord {
  id: number;
  title?: string | null;
  titleEn?: string | null;
  titleAr?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  subTitle?: string | null;
  subTitleEn?: string | null;
  subTitleAr?: string | null;
  publishedAt: string | null;
  categoryId: number;
  categoryName?: string | null;
  categoryNameEn?: string | null;
  categoryNameAr?: string | null;
  programsId: number | null;
  images: string[] | null;
}

export interface NewsCategoryGroup {
  categoryId: number;
  categoryNameEn: string;
  categoryNameAr: string;
  news: NewsRecord[];
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private readonly apiUrl = isPlatformBrowser(inject(PLATFORM_ID))
    ? '/api/News'
    : `${environment.baseUrl}/api/News`;
  private readonly httpClient = inject(HttpClient);

  getAllGroupedByCategory(language: 'en' | 'ar' = 'en'): Observable<NewsCategoryGroup[]> {
    return this.httpClient
      .get<NewsCategoryGroup[]>(`${this.apiUrl}/GetAllGroupedByCategory`, {
        params: { lang: language }
      })
      .pipe(retry({ count: 2, delay: this.retryDelay }));
  }

  getById(id: number | string, language: 'en' | 'ar' = 'en'): Observable<NewsRecord> {
    return this.httpClient
      .get<NewsRecord>(`${this.apiUrl}/GetById/${id}`, {
        params: { lang: language }
      })
      .pipe(retry({ count: 2, delay: this.retryDelay }));
  }

  private readonly retryDelay = (error: HttpErrorResponse, retryCount: number) => {
    const transientStatuses = [0, 500, 502, 503, 504];
    return transientStatuses.includes(error.status)
      ? timer(retryCount * 500)
      : throwError(() => error);
  };
}
