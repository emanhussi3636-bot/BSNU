import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap, takeUntil } from 'rxjs/operators';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { LanguageService } from '../services/language.service';
import { environment } from '../environment/environment';

interface BannerApiItem {
  title: string;
  imageUrl: string;
  order: number;
}

const BANNER_API_ORIGIN = environment.baseUrl;

function isBannerApiItem(value: unknown): value is BannerApiItem {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;
  return (
    typeof item['title'] === 'string' &&
    typeof item['imageUrl'] === 'string' &&
    Number.isFinite(item['order'])
  );
}

function parseBannerResponse(value: unknown): BannerApiItem[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every(isBannerApiItem)
  ) {
    throw new Error('The banner API returned an invalid response.');
  }

  return value;
}

function createHeroBanners(banners: BannerApiItem[]): BannerApiItem[] {
  return [...banners]
    .sort((first, second) => first.order - second.order)
    .map((banner) => {
      const imageUrl = new URL(banner.imageUrl, `${BANNER_API_ORIGIN}/`);
      const allowedOrigins = new Set(environment.supportedApiOrigins);
      if (
        (!allowedOrigins.has(imageUrl.origin) && imageUrl.origin !== BANNER_API_ORIGIN) ||
        !imageUrl.pathname.startsWith('/assets/hero/')
      ) {
        throw new Error(`The banner API returned an unsupported image path: ${banner.imageUrl}`);
      }

      return {
        ...banner,
        imageUrl: `/api/banner-assets${imageUrl.pathname}`
      };
    });
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('heroSwiper') private swiperElement?: ElementRef<HTMLElement>;

  banners: BannerApiItem[] = [];
  isLoading = true;
  loadError = false;
  scrolled = false;

  private swiper: Swiper | null = null;
  private swiperUpdateFrame: number | null = null;
  private viewInitialized = false;
  private readonly destroy$ = new Subject<void>();
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: object,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.onWindowScroll();
    this.langService.currentLang$
      .pipe(
        distinctUntilChanged(),
        switchMap((language) => {
          this.isLoading = true;
          this.loadError = false;
          return this.http
            .get<unknown>('/api/Banner', {
              params: { lang: language === 'ar' ? 'ar' : 'en' }
            })
            .pipe(
              map(parseBannerResponse),
              map(createHeroBanners),
              catchError((error: unknown) => {
                console.error('Failed to load hero banners.', error);
                this.isLoading = false;
                this.loadError = true;
                this.banners = [];
                this.updateSwiper();
                return of([]);
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((banners) => {
        this.banners = banners;
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

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scrolled = window.scrollY > 50;
  }

  private updateSwiper(): void {
    if (!isPlatformBrowser(this.platformId) || !this.viewInitialized || !this.swiperElement) {
      return;
    }

    const element = this.swiperElement.nativeElement;
    const renderedSlideCount = element.querySelectorAll('.swiper-slide').length;
    if (this.banners.length > 0 && renderedSlideCount !== this.banners.length) {
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

    if (this.banners.length < 2) {
      return;
    }

    const nextButton = element.querySelector<HTMLElement>('.carousel-control-next');
    const previousButton = element.querySelector<HTMLElement>('.carousel-control-prev');
    const pagination = element.querySelector<HTMLElement>('.swiper-pagination');

    this.swiper = new Swiper(element, {
      loop: false,
      rewind: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      pagination: pagination ? { el: pagination, clickable: true } : undefined,
      navigation: nextButton && previousButton
        ? { nextEl: nextButton, prevEl: previousButton }
        : undefined,
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'slide'
    });

    if (!this.swiper.autoplay.running) {
      this.swiper.autoplay.start();
    }
  }
}
