import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, catchError, of, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { NewsRecord, NewsService } from '../news.service';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-newsdetails',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './newsdetails.component.html',
  styleUrl: './newsdetails.component.css'
})
export class NewsDetailsComponent implements OnDestroy {
  news: NewsRecord | null = null;
  imageUrls: string[] = [];
  selectedImageIndex = 0;
  isLoading = true;
  loadError = false;
  currentLanguage: 'en' | 'ar' = 'en';
  private readonly subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private readonly newsService: NewsService,
    public langService: LanguageService
  ) {
    this.subscriptions.add(
      this.langService.currentLang$.subscribe((language) => {
        this.currentLanguage = language;
      })
    );

    this.subscriptions.add(
      this.route.paramMap
        .pipe(
          switchMap((params) => {
            const id = params.get('id') ?? '';
            this.isLoading = true;
            this.loadError = false;
            this.news = null;
            this.imageUrls = [];
            this.selectedImageIndex = 0;

            if (!/^\d+$/.test(id)) {
              this.isLoading = false;
              return of(null);
            }

            return this.newsService.getById(id).pipe(
              catchError((error: unknown) => {
                console.error('Failed to load news details from the API.', error);
                this.loadError = true;
                this.isLoading = false;
                return of(null);
              })
            );
          })
        )
        .subscribe((news) => {
          this.news = news;
          this.imageUrls = news ? this.getImageUrls(news) : [];
          this.isLoading = false;
        })
    );
  }

  title(news: NewsRecord): string {
    return this.currentLanguage === 'ar'
      ? news.titleAr || news.titleEn || news.title || ''
      : news.titleEn || news.titleAr || news.title || '';
  }

  description(news: NewsRecord): string {
    const description = this.currentLanguage === 'ar'
      ? news.descriptionAr || news.descriptionEn || news.description
      : news.descriptionEn || news.descriptionAr || news.description;
    return description || '';
  }

  subtitle(news: NewsRecord): string {
    const subtitle = this.currentLanguage === 'ar'
      ? news.subTitleAr || news.subTitleEn || news.subTitle
      : news.subTitleEn || news.subTitleAr || news.subTitle;
    return subtitle || this.description(news);
  }

  categoryName(news: NewsRecord): string {
    return this.currentLanguage === 'ar'
      ? news.categoryNameAr || news.categoryNameEn || news.categoryName || ''
      : news.categoryNameEn || news.categoryNameAr || news.categoryName || '';
  }

  showImage(index: number): void {
    if (index >= 0 && index < this.imageUrls.length) {
      this.selectedImageIndex = index;
    }
  }

  showPreviousImage(): void {
    if (this.imageUrls.length < 2) {
      return;
    }

    this.selectedImageIndex =
      (this.selectedImageIndex - 1 + this.imageUrls.length) % this.imageUrls.length;
  }

  showNextImage(): void {
    if (this.imageUrls.length < 2) {
      return;
    }

    this.selectedImageIndex = (this.selectedImageIndex + 1) % this.imageUrls.length;
  }

  private getImageUrls(news: NewsRecord): string[] {
    return (news.images ?? []).flatMap((image) => {
      if (!image) {
        return [];
      }

      const url = new URL(image, `${environment.baseUrl}/`);
      return url.protocol === 'http:' || url.protocol === 'https:' ? [url.href] : [];
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}