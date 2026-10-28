import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, catchError, of, switchMap } from 'rxjs';
import { LanguageService } from '../services/language.service';
import {
  UniversityRoleName,
  UniversityRoleUser,
  VicePresidentService
} from '../services/vice-president.service';
import { environment } from '../environment/environment';

interface VicePresident {
  id: number | string;
  title: string;
  NAME: string;
  JOBTITLE: string;
  description: string;
  BIO: string;
  image: string;
  VIDEO: string;
}

const UNIVERSITY_ROLE_ALIASES: Record<string, UniversityRoleName> = {
  President: 'President',
  Presitent: 'President',
  VicePresidentAcademic: 'VicePresidentAcademic',
  VicePresitentAcademic: 'VicePresidentAcademic',
  AffairsLead: 'AffairsLead'
};

@Component({
  selector: 'app-vice-president',
  imports: [CommonModule],
  templateUrl: './vice-president.component.html',
  styleUrl: './vice-president.component.css'
})
export class VicePresidentComponent implements OnInit, OnDestroy {
selectedVicePresident: VicePresident | null = null;
showPresidentVideo = false;
isLoading = true;
loadError = false;
notFound = false;

private roleUser: UniversityRoleUser | null = null;
private currentLanguage: 'en' | 'ar' = 'en';
private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly vicePresidentService: VicePresidentService,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$.subscribe((language) => {
        this.currentLanguage = language;
        this.mapRoleUser();
      })
    );

    this.subscriptions.add(
      this.route.paramMap.pipe(
        switchMap((params) => {
          const routeRoleName = params.get('id');
          const roleName = routeRoleName ? UNIVERSITY_ROLE_ALIASES[routeRoleName] : undefined;
          this.roleUser = null;
          this.selectedVicePresident = null;
          this.loadError = false;
          this.notFound = false;
          this.isLoading = true;

          if (!roleName) {
            this.isLoading = false;
            this.notFound = true;
            return of(null);
          }

          return this.vicePresidentService.getUserByRole(roleName).pipe(
            catchError((error: unknown) => {
              console.error(`Failed to load university user for role ${routeRoleName}.`, error);
              this.loadError = true;
              this.isLoading = false;
              return of(null);
            })
          );
        })
      ).subscribe((user) => {
        this.roleUser = user;
        this.isLoading = false;
        this.notFound = !user && !this.loadError;
        this.mapRoleUser();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private mapRoleUser(): void {
    if (!this.roleUser) {
      this.selectedVicePresident = null;
      this.showPresidentVideo = false;
      return;
    }

    const localized = (
      english?: string | null,
      arabic?: string | null,
      value?: string | null
    ): string =>
      (this.currentLanguage === 'ar' ? arabic : english) || english || arabic || value || '';
    const imageUrl = this.roleUser.imagePath
      ? new URL(this.roleUser.imagePath, `${environment.baseUrl}/`).href
      : '';
    const localMember = this.langService.getCurrentLanguageData()
      ?.VicePresident?.MEMBER?.[String(this.roleUser.id)];

    this.selectedVicePresident = {
      id: this.roleUser.id,
      title: localized(
        this.roleUser.descriptionEn,
        this.roleUser.descriptionAr,
        this.roleUser.description
      ),
      NAME: localized(this.roleUser.fullNameEn, this.roleUser.fullNameAr, this.roleUser.fullName),
      JOBTITLE: localized(this.roleUser.jobTitleEn, this.roleUser.jobTitleAr, this.roleUser.jobTitle),
      description: '',
      BIO: localized(this.roleUser.bioEn, this.roleUser.bioAr, this.roleUser.bio),
      image: imageUrl,
      VIDEO: localMember?.VIDEO || ''
    };
    this.showPresidentVideo = String(this.roleUser.id) === '5';
  }
}
