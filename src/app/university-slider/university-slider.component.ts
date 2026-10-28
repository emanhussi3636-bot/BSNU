import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { Subject, catchError, distinctUntilChanged, map, of, switchMap, takeUntil } from 'rxjs';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { LanguageService } from '../services/language.service';
import { environment } from '../environment/environment';

interface UniversityProfileSlide {
  title: string;
  number: string;
  slideTitle: string;
  desc: string;
  image: string;
  imageUrl: string;
}

interface UniversityProfileApiSlide {
  title: string;
  number: string | number;
  slideTitle: string;
  desc: string;
  image: string;
}

const PROFILE_API_ORIGIN = environment.baseUrl;

function isUniversityProfileSlide(value: unknown): value is UniversityProfileApiSlide {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const slide = value as Record<string, unknown>;
  return (
    typeof slide['title'] === 'string' &&
    (typeof slide['number'] === 'string' || typeof slide['number'] === 'number') &&
    typeof slide['slideTitle'] === 'string' &&
    typeof slide['desc'] === 'string' &&
    typeof slide['image'] === 'string'
  );
}

function parseUniversityProfile(value: unknown): UniversityProfileSlide[] {
  if (!Array.isArray(value) || !value.every(isUniversityProfileSlide)) {
    throw new Error('The university profile API returned an invalid response.');
  }

  return value.map((slide) => {
    const imageUrl = new URL(slide.image, `${PROFILE_API_ORIGIN}/`);
    const allowedOrigins = new Set(environment.supportedApiOrigins);
    if (
      (!allowedOrigins.has(imageUrl.origin) && imageUrl.origin !== PROFILE_API_ORIGIN) ||
      !imageUrl.pathname.startsWith('/assets/profile/')
    ) {
      throw new Error(`The university profile API returned an unsupported image path: ${slide.image}`);
    }

    return {
      ...slide,
      number: String(slide.number),
      imageUrl: `/api/profile-assets${imageUrl.pathname}`
    };
  });
}

@Component({
  selector: 'app-university-slider',
  templateUrl: './university-slider.component.html',
  styleUrls: ['./university-slider.component.css']
})
export class UniversitySliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('profileSwiper') private swiperElement?: ElementRef<HTMLElement>;

  slides: UniversityProfileSlide[] = [];
  failedImageUrls = new Set<string>();
  isLoading = true;
  loadError = false;

  private swiper: Swiper | null = null;
  private viewInitialized = false;
  private swiperUpdateFrame: number | null = null;
  private readonly destroy$ = new Subject<void>();
  private readonly profileApiUrl: string;
  dir = 'ltr';

  constructor(
    private readonly http: HttpClient,
    private readonly changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    public langService: LanguageService
  ) {
    this.profileApiUrl = isPlatformBrowser(platformId)
      ? '/api/ProfileUniversty'
      : `${PROFILE_API_ORIGIN}/api/ProfileUniversty`;

    this.langService.currentLang$
      .pipe(
        distinctUntilChanged(),
        switchMap((language) => {
          this.dir = language === 'ar' ? 'rtl' : 'ltr';
          this.isLoading = true;
          this.loadError = false;
          this.slides = [];

          return this.http
            .get<unknown>(this.profileApiUrl, {
              params: { lang: language === 'ar' ? 'ar' : 'en' }
            })
            .pipe(
              map(parseUniversityProfile),
              catchError((error: unknown) => {
                console.error('Failed to load the university profile from the API.', error);
                this.isLoading = false;
                this.loadError = true;
                this.updateSwiper();
                return of([]);
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((slides) => {
        this.slides = slides;
        this.failedImageUrls.clear();
        this.isLoading = false;
        this.changeDetector.detectChanges();
        this.updateSwiper();
      });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.updateSwiper();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.swiperUpdateFrame !== null) {
      cancelAnimationFrame(this.swiperUpdateFrame);
    }
    this.swiper?.destroy(true, true);
  }

  markImageUnavailable(imageUrl: string): void {
    this.failedImageUrls.add(imageUrl);
  }

  private updateSwiper(): void {
    if (!isPlatformBrowser(this.platformId) || !this.viewInitialized || !this.swiperElement) {
      return;
    }

    const element = this.swiperElement.nativeElement;
    const renderedSlideCount = element.querySelectorAll('.swiper-slide').length;
    if (renderedSlideCount !== this.slides.length) {
      if (this.swiperUpdateFrame === null) {
        this.swiperUpdateFrame = requestAnimationFrame(() => {
          this.swiperUpdateFrame = null;
          this.updateSwiper();
        });
      }
      return;
    }

    if (this.swiperUpdateFrame !== null) {
      cancelAnimationFrame(this.swiperUpdateFrame);
      this.swiperUpdateFrame = null;
    }

    this.swiper?.destroy(true, true);
    this.swiper = null;

    if (this.slides.length < 2) {
      return;
    }

    const nextButton = element.querySelector<HTMLElement>('.carousel-control-next');
    const previousButton = element.querySelector<HTMLElement>('.carousel-control-prev');
    const pagination = element.querySelector<HTMLElement>('.swiper-pagination');

    this.swiper = new Swiper(element, {
      loop: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      },
      pagination: pagination ? { el: pagination, clickable: true } : undefined,
      navigation: nextButton && previousButton
        ? { nextEl: nextButton, prevEl: previousButton }
        : undefined,
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'slide'
    });
  }
}
