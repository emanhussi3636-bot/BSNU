import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, catchError, map, of, switchMap } from 'rxjs';
import { EventRecord, EventsService } from '../events.service';
import { environment } from '../environment/environment';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-all-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.css'
})
export class AllEventsComponent implements OnInit, OnDestroy {
  events: EventRecord[] = [];
  selectedProgramId: number | null = null;
  searchTerm = '';
  isLoading = true;
  loadError = false;

  private readonly subscriptions = new Subscription();
  private currentLanguage: 'en' | 'ar' = 'en';

  constructor(
    private readonly eventsService: EventsService,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$
        .pipe(
          switchMap((language) => {
            this.currentLanguage = language;
            this.isLoading = true;
            this.loadError = false;
            this.events = [];

            return this.eventsService.getEvents(language).pipe(
              map((events) =>
                events
                  .filter((event) => event.isPublished)
                  .sort((left, right) => this.getStartTime(right) - this.getStartTime(left))
              ),
              catchError((error: unknown) => {
                console.error('Failed to load events from the API.', error);
                this.loadError = true;
                this.isLoading = false;
                return of([]);
              })
            );
          })
        )
        .subscribe((events) => {
          this.events = events;
          this.isLoading = false;
        })
    );
  }

  get programIds(): number[] {
    return [...new Set(this.events.map((event) => event.programsId))].sort((left, right) => left - right);
  }

  get visibleEvents(): EventRecord[] {
    const search = this.searchTerm.trim().toLocaleLowerCase();

    return this.events.filter((event) => {
      const matchesProgram =
        this.selectedProgramId === null || event.programsId === this.selectedProgramId;
      const searchableText = [event.title, event.description, event.detail, event.location]
        .filter((value): value is string => !!value)
        .join(' ')
        .toLocaleLowerCase();

      return matchesProgram && (!search || searchableText.includes(search));
    });
  }

  updateSearch(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      this.searchTerm = target.value;
    }
  }

  selectProgram(programId: number | null): void {
    this.selectedProgramId = programId;
  }

  imageUrl(event: EventRecord): string | null {
    const image = [...(event.images ?? [])]
      .sort((left, right) => {
        if (left.isMain !== right.isMain) {
          return left.isMain ? -1 : 1;
        }
        return left.displayOrder - right.displayOrder;
      })
      .find((item) => !!item.imageUrl);

    if (!image?.imageUrl) {
      return null;
    }

    const url = new URL(image.imageUrl, `${environment.baseUrl}/`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  }

  formatDate(date: string | null): string {
    if (!date) {
      return this.langService.translate('ALL_EVENTS.DATE_UNANNOUNCED');
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return this.langService.translate('ALL_EVENTS.DATE_UNANNOUNCED');
    }

    return new Intl.DateTimeFormat(this.currentLanguage, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(parsedDate);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getStartTime(event: EventRecord): number {
    if (!event.startDate) {
      return 0;
    }

    const startTime = new Date(event.startDate).getTime();
    return Number.isNaN(startTime) ? 0 : startTime;
  }
}
