import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { LanguageService } from '../services/language.service';
import { Subscription } from 'rxjs';
import {
  FacultyApiResponse,
  FacultyRecord,
  FacultyserviceService
} from '../services/facultyservice.service';
import { environment } from '../environment/environment';

interface BootstrapCarouselInstance {
  cycle(): void;
  dispose(): void;
}

interface BootstrapCarouselApi {
  getOrCreateInstance(
    element: Element,
    options: { interval: number; pause: false; ride: 'carousel'; wrap: boolean }
  ): BootstrapCarouselInstance;
}

declare global {
  interface Window {
    bootstrap?: {
      Carousel: BootstrapCarouselApi;
    };
  }
}

interface FacultyCard extends FacultyRecord {
  imageUrl: string | null;
}

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css'
})
export class DepartmentsComponent implements OnInit, AfterViewInit, OnDestroy {
  faculties: FacultyCard[] = [];
  facultySlides: FacultyCard[][] = [];
  failedImageUrls = new Set<string>();
  currentLanguage: 'en' | 'ar' = 'en';
  loading = true;
  loadError = false;

  private carouselInstance?: BootstrapCarouselInstance;
  private viewInitialized = false;
  private readonly subscriptions = new Subscription();
  private readonly facultyService = inject(FacultyserviceService);
  private readonly changeDetector = inject(ChangeDetectorRef);

  constructor(
    public langService: LanguageService,
    private hostElement: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$.subscribe((language) => {
        this.currentLanguage = language;
      })
    );

    this.facultyService.getAllFaculties().subscribe({
      next: (response: FacultyApiResponse) => {
        const records = Array.isArray(response) ? response : response.value;
        this.faculties = records.map((faculty) => ({
          ...faculty,
          imageUrl: this.getImageUrl(faculty.image)
        }));
        this.facultySlides = this.createSlides(this.faculties);
        this.loading = false;
        this.changeDetector.detectChanges();
        this.initializeCarousel();
      },
      error: (error: unknown) => {
        console.error('Unable to load faculties from the faculty API.', error);
        this.loading = false;
        this.loadError = true;
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.initializeCarousel();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.carouselInstance?.dispose();
  }

  facultyName(faculty: FacultyRecord): string {
    const englishName = faculty.nameEn ?? faculty.nameEnglish ?? faculty.englishName ?? faculty.name;
    const arabicName = faculty.nameAr ?? faculty.nameArabic ?? faculty.arabicName;

    if (this.currentLanguage === 'ar') {
      if (arabicName) {
        return arabicName;
      }

      const translationKey = this.translationKeyFor(englishName ?? faculty.name);
      const translation = translationKey
        ? this.langService.translate(`DEPARTMENTS.${translationKey}`)
        : '';
      return translation && translation !== `DEPARTMENTS.${translationKey}`
        ? translation
        : englishName ?? faculty.name ?? '';
    }

    return englishName ?? faculty.name ?? arabicName ?? '';
  }

  markImageUnavailable(imageUrl: string): void {
    this.failedImageUrls.add(imageUrl);
  }

  private getImageUrl(imagePath?: string | null): string | null {
    if (!imagePath) {
      return null;
    }
    const imageUrl = new URL(imagePath, `${environment.baseUrl}/`);
    return imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:'
      ? imageUrl.href
      : null;
  }

  private createSlides(faculties: FacultyCard[]): FacultyCard[][] {
    const slides: FacultyCard[][] = [];
    for (let index = 0; index < faculties.length; index += 4) {
      slides.push(faculties.slice(index, index + 4));
    }
    return slides;
  }

  private translationKeyFor(name?: string): string | null {
    const normalizedName = name?.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() ?? '';
    const facultyNames: Array<[string, string]> = [
      ['Faculty_of_Medicine', 'medicine'],
      ['Faculty_of_Pharmacy', 'pharmacy'],
      ['Faculty_of_Dentistry', 'dentistry'],
      ['Faculty_of_Nursing', 'nursing'],
      ['Faculty_of_Physical_therapy', 'physical therapy'],
      ['Faculty_of_Engineering', 'engineering'],
      ['Faculty_of_Computers_IT', 'computers'],
      ['Faculty_of_Science', 'science'],
      ['Faculty_of_Mass_comm', 'mass communication'],
      ['Faculty_of_Commerce', 'commerce'],
      ['Faculty_of_Arts', 'arts'],
      ['Faculty_of_law', 'law'],
      ['Faculty_of_Navigation_and_Space_Sciences', 'navigation sciences']
    ];

    return facultyNames.find(([, term]) => normalizedName.includes(term))?.[0] ?? null;
  }

  private initializeCarousel(): void {
    if (
      !isPlatformBrowser(this.platformId) ||
      !this.viewInitialized ||
      this.facultySlides.length < 2 ||
      this.carouselInstance
    ) {
      return;
    }

    const carouselElement = this.hostElement.nativeElement.querySelector<HTMLElement>('#facultyCarousel');
    if (!carouselElement) {
      return;
    }

    const carouselApi = window.bootstrap?.Carousel;
    if (!carouselApi) {
      console.error('Bootstrap Carousel is unavailable; verify bootstrap.bundle.min.js is configured.');
      return;
    }

    this.carouselInstance = carouselApi.getOrCreateInstance(carouselElement, {
      interval: 5000,
      pause: false,
      ride: 'carousel',
      wrap: true
    });
    this.carouselInstance.cycle();
  }
}
