import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-tutionfees',
  imports: [CommonModule],
  templateUrl: './tutionfees.component.html',
  styleUrl: './tutionfees.component.css'
})
export class TutionfeesComponent implements OnDestroy {
  dir = 'ltr';
  private langSub: Subscription;

  constructor(public langService: LanguageService) {
    this.langSub = this.langService.currentLang$.subscribe((lang) => {
      this.dir = lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  get tuitionFees() {
    const value = this.langService.translate('TUTIONFEES.ROWS') as unknown;
    return Array.isArray(value) ? value : [];
  }

  ngOnDestroy() {
    this.langSub.unsubscribe();
  }
}
