import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, catchError, of, switchMap } from 'rxjs';
import { LanguageService } from '../services/language.service';
import {
  TuitionFeeRecord,
  TuitionFeesLanguage,
  TuitionFeesService
} from '../services/tuition-fees.service';

interface TuitionFeeRow {
  number: number;
  sector: string;
  program: string;
  fees: Record<number, number | null>;
}

interface TuitionFeeColumn {
  levelNumber: number;
  academicYear: string | null;
}

@Component({
  selector: 'app-tutionfees',
  imports: [CommonModule],
  templateUrl: './tutionfees.component.html',
  styleUrl: './tutionfees.component.css'
})
export class TutionfeesComponent implements OnInit, OnDestroy {
  dir = 'ltr';
  tuitionFees: TuitionFeeRow[] = [];
  levelColumns: TuitionFeeColumn[] = [];
  isLoading = true;
  loadError = false;
  private currentLanguage: TuitionFeesLanguage = 'en';
  private readonly subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private readonly tuitionFeesService: TuitionFeesService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$.pipe(
        switchMap((language) => {
          this.currentLanguage = language;
          this.dir = language === 'ar' ? 'rtl' : 'ltr';
          this.isLoading = true;
          this.loadError = false;
          this.tuitionFees = [];
          this.levelColumns = [];

          return this.tuitionFeesService.getTuitionFees(language).pipe(
            catchError((error: unknown) => {
              console.error('Failed to load tuition fees.', error);
              this.loadError = true;
              this.isLoading = false;
              return of([]);
            })
          );
        })
      ).subscribe((records) => {
        this.setTuitionFees(records);
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  formatFee(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) {
      return '';
    }

    const locale = this.currentLanguage === 'ar' ? 'ar-EG' : 'en-EG';
    const formattedAmount = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(amount);
    return this.currentLanguage === 'ar'
      ? `${formattedAmount} جنيه`
      : `${formattedAmount} EGP`;
  }

  private setTuitionFees(records: TuitionFeeRecord[]): void {
    const sortedRecords = [...records].sort((a, b) => a.displayOrder - b.displayOrder);
    const levelYears = new Map<number, string | null>();

    this.tuitionFees = sortedRecords.map((record, index) => {
      const levels = record.levels ?? [];
      const fees: Record<number, number | null> = {};

      for (const level of levels) {
        fees[level.levelNumber] = level.feeAmount;
        if (!levelYears.has(level.levelNumber)) {
          levelYears.set(level.levelNumber, level.academicYear);
        }
      }

      return {
        number: index + 1,
        sector: this.localizedValue(record.sectorNameEn, record.sectorNameAr),
        program: this.localizedValue(record.programNameEn, record.programNameAr),
        fees
      };
    });

    this.levelColumns = [...levelYears.entries()]
      .sort(([levelA], [levelB]) => levelA - levelB)
      .map(([levelNumber, academicYear]) => ({ levelNumber, academicYear }));
  }

  private localizedValue(english: string | null, arabic: string | null): string {
    return (this.currentLanguage === 'ar' ? arabic : english) || english || arabic || '';
  }
}
