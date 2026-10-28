import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import en from '../../../public/i18n/en.json';
import ar from '../../../public/i18n/ar.json';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private languages: any = {
    en,
    ar
  };

  private currentLang = new BehaviorSubject<'en' | 'ar'>('en');
  currentLang$ = this.currentLang.asObservable();

  setLanguage(lang: 'en' | 'ar') {
    this.currentLang.next(lang);
  }

  getCurrentLanguageData(): any {
    return this.languages[this.currentLang.value];
  }

  translate(key: string): string {
    const lang = this.currentLang.value;
    const value = key.split('.').reduce((obj, k) => obj?.[k], this.languages[lang]);

    if (value !== undefined && value !== null) {
      return value;
    }

    const fallback = key.split('.').reduce((obj, k) => obj?.[k], this.languages['en']);
    return fallback ?? key;
  }
}
