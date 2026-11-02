import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Observable, retry, throwError, timer } from 'rxjs';
import { environment } from '../environment/environment';

export interface FacultyRecord {
  id?: number | string;
  name?: string;
  nameEn?: string;
  nameAr?: string;
  nameEnglish?: string;
  nameArabic?: string;
  englishName?: string;
  arabicName?: string;
  image?: string | null;
  video?: string | null;
}

export interface FacultyApiCollection {
  value: FacultyRecord[];
  Count?: number;
}

export type FacultyApiResponse = FacultyRecord[] | FacultyApiCollection;

export interface ProgramRecord {
  id: number | string;
  name: string;
}

export interface FacultyWithProgramsRecord extends FacultyRecord {
  id: number | string;
  name: string;
  programs: ProgramRecord[];
}

export interface FacultyWithProgramsApiCollection {
  value: FacultyWithProgramsRecord[];
  Count?: number;
}

export type FacultyWithProgramsApiResponse =
  | FacultyWithProgramsRecord[]
  | FacultyWithProgramsApiCollection;

export interface ProgramManager {
  id: number | string;
  name: string;
  image?: string | null;
  bio?: string | null;
  jobTitle?: string | null;
}

export interface ProgramDetails {
  id: number | string;
  name: string;
  description?: string | null;
  duration?: string | null;
  studySystem?: string | null;
  creditHours?: string | number | null;
  academicDegree?: string | null;
  studentsCount?: number | null;
  jobTitles?: string | null;
  mission?: string | null;
  vision?: string | null;
  videoPath?: string | null;
  programManager?: ProgramManager & { title?: string | null };
  requirements?: Array<{
    id: number | string;
    requirementName: string;
    totalHours?: string | number | null;
    hours?: string | number | null;
    creditHours?: string | number | null;
  }>;
  goals?: Array<{ id: number | string; description: string }>;
  beneficiaries?: Array<{ id: number | string; description: string }>;
  images?: Array<{ id: number | string; imagePath: string }>;
  schedules?: Array<{ id: number | string; fileName: string }>;
  events?: Array<{
    id: number | string;
    title: string;
    description?: string | null;
    detail?: string | null;
    location?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    images?: Array<{ id: number | string; imagePath: string; isMain?: boolean }>;
  }>;
}

export type SupportedLanguage = 'en' | 'ar';

@Injectable({
  providedIn: 'root'
})
export class FacultyserviceService {
  private readonly apiUrl = isPlatformBrowser(inject(PLATFORM_ID))
    ? '/api/Faculty'
    : `${environment.baseUrl}/api/Faculty`;
  private readonly programApiUrl = isPlatformBrowser(inject(PLATFORM_ID))
    ? '/api/Program'
    : `${environment.baseUrl}/api/Program`;
  private readonly httpClient = inject(HttpClient);

  getAllFaculties(): Observable<FacultyApiResponse> {
    return this.httpClient.get<FacultyApiResponse>(this.apiUrl).pipe(
      retry({ count: 2, delay: this.retryDelay })
    );
  }

  getFacultiesWithPrograms(): Observable<FacultyWithProgramsApiResponse> {
    return this.httpClient.get<FacultyWithProgramsApiResponse>(`${this.apiUrl}/with-programs`).pipe(
      retry({ count: 2, delay: this.retryDelay })
    );
  }

  getProgram(
    programId: number | string,
    language: SupportedLanguage = 'en'
  ): Observable<ProgramDetails> {
    const params = new HttpParams().set('lang', language);
    return this.httpClient.get<ProgramDetails>(`${this.programApiUrl}/${programId}`, { params }).pipe(
      retry({ count: 2, delay: this.retryDelay })
    );
  }

  getProgramManager(
    programId: number | string,
    language: SupportedLanguage = 'en'
  ): Observable<ProgramManager> {
    const params = new HttpParams().set('lang', language);
    return this.httpClient.get<ProgramManager>(`/api/Program/${programId}/manager`, { params });
  }

  getSectorDean(
    sectorId: number | string,
    language: SupportedLanguage = 'en'
  ): Observable<ProgramManager> {
    const params = new HttpParams().set('lang', language);
    return this.httpClient.get<ProgramManager>(`/api/Sector/${sectorId}/dean`, { params });
  }

  private readonly retryDelay = (error: HttpErrorResponse, retryCount: number) => {
    const transientStatuses = [0, 500, 502, 503, 504];
    return transientStatuses.includes(error.status)
      ? timer(retryCount * 500)
      : throwError(() => error);
  };
}
