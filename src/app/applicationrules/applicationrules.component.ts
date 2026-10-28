import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription, catchError, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { environment } from '../environment/environment';

interface ApplicationRuleDocument {
  id?: number | string;
  item: string;
}

interface ApplicationRule {
  id?: number | string;
  label: string;
  heading: string;
  description: string;
  documents: ApplicationRuleDocument[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isApplicationRuleDocument(value: unknown): value is ApplicationRuleDocument {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value['id'] === undefined ||
      typeof value['id'] === 'number' ||
      typeof value['id'] === 'string') &&
    typeof value['item'] === 'string'
  );
}

function isApplicationRule(value: unknown): value is ApplicationRule {
  if (!isRecord(value)) {
    return false;
  }

  return (
    (value['id'] === undefined ||
      typeof value['id'] === 'number' ||
      typeof value['id'] === 'string') &&
    typeof value['label'] === 'string' &&
    typeof value['heading'] === 'string' &&
    typeof value['description'] === 'string' &&
    Array.isArray(value['documents']) &&
    value['documents'].every(isApplicationRuleDocument)
  );
}

function parseApplicationRules(value: unknown): ApplicationRule[] {
  if (!Array.isArray(value)) {
    throw new Error('The application rules API returned an invalid response.');
  }

  const rules = value.filter(isApplicationRule);
  if (rules.length === 0 || rules.length !== value.length) {
    throw new Error('The application rules API returned no valid rule categories.');
  }

  return rules;
}

@Component({
  selector: 'app-applicationrules',
  imports: [],
  templateUrl: './applicationrules.component.html',
  styleUrls: ['./applicationrules.component.css']
})
export class ApplicationrulesComponent implements OnDestroy {
  rules: ApplicationRule[] = [];
  activeRuleIndex = 0;
  dir = 'ltr';
  isLoading = true;
  loadError = false;

  private readonly subscriptions = new Subscription();
  private readonly rulesApiUrl: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    public langService: LanguageService
  ) {
    this.rulesApiUrl = isPlatformBrowser(platformId)
      ? '/api/ApplicationRules'
      : `${environment.baseUrl}/api/ApplicationRules`;

    this.subscriptions.add(
      this.langService.currentLang$
        .pipe(
          distinctUntilChanged(),
          switchMap((lang) => {
            this.dir = lang === 'ar' ? 'rtl' : 'ltr';
            this.isLoading = true;
            this.loadError = false;
            this.rules = [];

            return this.http
              .get<unknown>(this.rulesApiUrl, {
                params: { lang: lang === 'ar' ? 'ar' : 'en' }
              })
              .pipe(
                map(parseApplicationRules),
                catchError((error: unknown) => {
                  console.error('Failed to load application rules from the API.', error);
                  this.loadError = true;
                  this.isLoading = false;
                  return of([]);
                })
              );
          })
        )
        .subscribe((rules) => {
          this.rules = rules;
          this.activeRuleIndex = Math.min(this.activeRuleIndex, Math.max(rules.length - 1, 0));
          this.isLoading = false;
        })
    );
  }

  selectTab(index: number): void {
    this.activeRuleIndex = index;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
