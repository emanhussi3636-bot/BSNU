import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, catchError, of, switchMap } from 'rxjs';
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
  program: ProgramDetails | null = null;
  currentImageIndex = 0;
  isLoading = true;
  loadError = false;
  notFound = false;

  private readonly subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private readonly cdr: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly facultyService: FacultyserviceService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(this.langService.currentLang$.subscribe(() => {
      this.cdr.markForCheck();
    }));

    this.subscriptions.add(this.route.paramMap.pipe(
      switchMap((params) => {
        const id = params.get('id') ?? '1';
        this.program = null;
        this.currentImageIndex = 0;
        this.isLoading = true;
        this.loadError = false;
        this.notFound = false;

        if (!/^\d+$/.test(id)) {
          this.isLoading = false;
          this.notFound = true;
          return of(null);
        }

        return this.facultyService.getProgram(id).pipe(
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
