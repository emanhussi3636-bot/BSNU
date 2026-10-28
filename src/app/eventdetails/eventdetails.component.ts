import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { EventRecord, EventsService } from '../events.service';
import { LanguageService } from '../services/language.service';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-eventdetails',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './eventdetails.component.html',
  styleUrl: './eventdetails.component.css'
})
export class EventdetailsComponent implements OnInit, OnDestroy {
  selectedEvent?: EventRecord;
  eventImages: string[] = [];
  currentImageIndex = 0;
  isLoading = true;
  loadError = false;
  notFound = false;

  private readonly subscriptions = new Subscription();
  private currentLanguage: 'en' | 'ar' = 'en';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([this.route.paramMap, this.langService.currentLang$])
        .pipe(
          switchMap(([params, language]) => {
            this.currentLanguage = language;
            const eventId = params.get('eventId');
            this.selectedEvent = undefined;
            this.eventImages = [];
            this.currentImageIndex = 0;
            this.loadError = false;
            this.notFound = false;
            this.isLoading = true;

            if (!eventId || !/^\d+$/.test(eventId) || Number(eventId) > 2147483647) {
              this.isLoading = false;
              this.notFound = true;
              return of(null);
            }

            return this.eventsService.getEventById(eventId, language).pipe(
              map((event) => ({
                event,
                images: (event.images ?? [])
                  .filter((image) => !!image.imageUrl)
                  .sort((left, right) => left.displayOrder - right.displayOrder)
                  .map((image) => this.getImageUrl(image.imageUrl))
                  .filter((imageUrl): imageUrl is string => imageUrl !== null)
              })),
              catchError((error: unknown) => {
                console.error(`Failed to load event ${eventId} from the API.`, error);
                this.notFound = error instanceof HttpErrorResponse && error.status === 404;
                this.loadError = !this.notFound;
                this.isLoading = false;
                return of(null);
              })
            );
          })
        )
        .subscribe((result) => {
          this.selectedEvent = result?.event;
          this.eventImages = result?.images ?? [];
          this.notFound = !result && !this.loadError && !this.notFound;
          this.isLoading = false;
        })
    );
  }

  showPreviousImage(): void {
    if (this.eventImages.length === 0) {
      return;
    }

    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.eventImages.length) %
      this.eventImages.length;
  }

  showNextImage(): void {
    if (this.eventImages.length === 0) {
      return;
    }

    this.currentImageIndex = (this.currentImageIndex + 1) % this.eventImages.length;
  }

  selectImage(index: number): void {
    if (index >= 0 && index < this.eventImages.length) {
      this.currentImageIndex = index;
    }
  }

  goBack(): void {
    this.router.navigate(['/all-events']);
  }

  formatDate(date: string | null): string | null {
    if (!date) {
      return null;
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat(this.currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(parsedDate);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getImageUrl(imagePath: string | null): string | null {
    if (!imagePath) {
      return null;
    }

    const imageUrl = new URL(imagePath, `${environment.baseUrl}/`);
    return imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:'
      ? imageUrl.href
      : null;
  }
}
