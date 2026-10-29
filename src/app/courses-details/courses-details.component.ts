import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, catchError, combineLatest, of, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { FacultyserviceService, ProgramDetails } from '../services/facultyservice.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-courses-details',
  imports: [CommonModule],
  templateUrl: './courses-details.component.html',
  styleUrl: './courses-details.component.css'
})
export class CoursesDetailsComponent implements OnInit, OnDestroy {
  private programData: ProgramDetails | null = null;

  get program(): ProgramDetails | null {
    return this.programData;
  }

  set program(value: ProgramDetails | null) {
    this.programData = value;
    this.updateVideoUrls();
  }

  currentImageIndex = 0;
  isLoading = true;
  loadError = false;
  notFound = false;
  youtubeEmbedUrl: SafeResourceUrl | null = null;
  directVideoUrl: string | null = null;

  private readonly subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly facultyService: FacultyserviceService,
    private readonly sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(combineLatest([
      this.route.paramMap,
      this.langService.currentLang$
    ]).pipe(
      switchMap(([params, language]) => {
        const id = params.get('id') ?? '1';
        this.program = null;
        this.youtubeEmbedUrl = null;
        this.directVideoUrl = null;
        this.currentImageIndex = 0;
        this.isLoading = true;
        this.loadError = false;
        this.notFound = false;

        if (!/^\d+$/.test(id)) {
          this.isLoading = false;
          this.notFound = true;
          return of(null);
        }

        return this.facultyService.getProgram(id, language).pipe(
          catchError((error: unknown) => {
            if (error instanceof HttpErrorResponse && error.status === 404) {
              this.notFound = true;
            } else {
              console.error(`Failed to load program ${id} from the API.`, error);
              this.loadError = true;
            }
            this.isLoading = false;
            return of(null);
          })
        );
      })
    ).subscribe((program) => {
      this.program = program;
      this.isLoading = false;
      this.cdr.markForCheck();
    }));
  }

  get programImages(): string[] {
    return (this.program?.images ?? [])
      .map((image) => this.assetUrl(image.imagePath))
      .filter((image): image is string => image !== null);
  }

  get programManagerImage(): string | null {
    const image = this.program?.programManager?.image;
    return image && new URL(image, `${environment.baseUrl}/`).pathname !== '/'
      ? this.assetUrl(image)
      : null;
  }

  private updateVideoUrls(): void {
    const videoPath = this.program?.videoPath?.trim().replace(/&amp;/gi, '&');
    if (!videoPath) {
      this.youtubeEmbedUrl = null;
      this.directVideoUrl = null;
      return;
    }

    let url: URL;
    try {
      const youtubeUrl = /^(?:www\.|m\.|music\.)?(?:youtube\.com|youtube-nocookie\.com|youtu\.be)(?:\/|$)/i;
      url = new URL(
        videoPath.startsWith('//')
          ? `https:${videoPath}`
          : youtubeUrl.test(videoPath)
            ? `https://${videoPath}`
            : videoPath
      );
    } catch {
      this.youtubeEmbedUrl = null;
      this.directVideoUrl = this.isYouTubeUrl(videoPath) ? null : this.assetUrl(videoPath);
      return;
    }

    const hostname = url.hostname.toLowerCase();
    if (!this.isYouTubeHost(hostname)) {
      this.youtubeEmbedUrl = null;
      this.directVideoUrl = this.assetUrl(videoPath);
      return;
    }

    const pathSegments = url.pathname.split('/').filter(Boolean);
    const videoId = hostname === 'youtu.be'
      ? pathSegments[0]
      : url.pathname === '/watch'
        ? url.searchParams.get('v')
        : ['embed', 'shorts', 'live', 'v'].includes(pathSegments[0])
          ? pathSegments[1]
          : null;

    if (!videoId || !/^[\w-]{11}$/.test(videoId)) {
      this.youtubeEmbedUrl = null;
      this.directVideoUrl = null;
      return;
    }

    this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube-nocookie.com/embed/${videoId}`
    );
    this.directVideoUrl = null;
  }

  private isYouTubeUrl(value: string): boolean {
    return /(?:youtube\.com|youtube-nocookie\.com|youtu\.be)/i.test(value);
  }

  private isYouTubeHost(hostname: string): boolean {
    return hostname === 'youtu.be' ||
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname === 'youtube-nocookie.com' ||
      hostname.endsWith('.youtube-nocookie.com');
  }

  assetUrl(path?: string | null): string | null {
    if (!path) {
      return null;
    }

    const url = new URL(path, `${environment.baseUrl}/`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  }

  showImage(index: number): void {
    if (index >= 0 && index < this.programImages.length) {
      this.currentImageIndex = index;
    }
  }

  showPreviousImage(): void {
    if (this.programImages.length > 1) {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.programImages.length) % this.programImages.length;
    }
  }

  showNextImage(): void {
    if (this.programImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.programImages.length;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
