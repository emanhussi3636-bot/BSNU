import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export type UniversityRoleName = 'President' | 'VicePresidentAcademic' | 'AffairsLead';

export interface UniversityRoleUser {
  id: number | string;
  fullName?: string | null;
  jobTitle?: string | null;
  description?: string | null;
  bio?: string | null;
  jobTitleAr?: string | null;
  jobTitleEn?: string | null;
  descriptionEn?: string | null;
  descriptionAr?: string | null;
  bioEn?: string | null;
  bioAr?: string | null;
  imagePath?: string | null;
  fullNameEn?: string | null;
  fullNameAr?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class VicePresidentService {
  private readonly httpClient = inject(HttpClient);

  getUserByRole(roleName: UniversityRoleName): Observable<UniversityRoleUser> {
    const params = new HttpParams().set('roleName', roleName);
    return this.httpClient.get<UniversityRoleUser>('/api/Users/byrole', { params });
  }
}
