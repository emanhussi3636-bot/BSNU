import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, retry, throwError, timer } from 'rxjs';
import { environment } from './environment/environment';

export interface NewsRecord {
  id: number;
  title?: string;
  titleEn: string;
  titleAr: string;
  description?: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  subTitle?: string | null;
  subTitleEn: string | null;
  subTitleAr: string | null;
  publishedAt: string | null;
  categoryId: number;
  categoryName?: string;
  categoryNameEn: string;
  categoryNameAr: string;
  programsId: number;
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

  getAllGroupedByCategory(): Observable<NewsCategoryGroup[]> {
    return this.httpClient
      .get<NewsCategoryGroup[]>(`${this.apiUrl}/GetAllGroupedByCategory`)
      .pipe(retry({ count: 2, delay: this.retryDelay }));
  }

  getById(id: number | string): Observable<NewsRecord> {
    return this.httpClient
      .get<NewsRecord>(`${this.apiUrl}/GetById/${id}`)
      .pipe(retry({ count: 2, delay: this.retryDelay }));
  }

  private readonly retryDelay = (error: HttpErrorResponse, retryCount: number) => {
    const transientStatuses = [0, 500, 502, 503, 504];
    return transientStatuses.includes(error.status)
      ? timer(retryCount * 500)
      : throwError(() => error);
  };
}
