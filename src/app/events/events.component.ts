import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription, catchError, map, of, switchMap } from 'rxjs';
import { EventRecord, EventsService } from '../events.service';
import { environment } from '../environment/environment';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-events',
  imports: [CommonModule, RouterLink],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit, OnDestroy {
  latestEvents: EventRecord[] = [];
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
            this.latestEvents = [];

            return this.eventsService.getEvents(language).pipe(
              map((events) =>
                events
                  .filter((event) => event.isPublished)
                  .sort((left, right) => {
                    const leftDate = left.startDate ? new Date(left.startDate).getTime() : 0;
                    const rightDate = right.startDate ? new Date(right.startDate).getTime() : 0;
                    return rightDate - leftDate;
                  })
                  .slice(0, 4)
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
          this.latestEvents = events;
          this.isLoading = false;
        })
    );
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
}
