import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, of, Subscription, switchMap } from 'rxjs';
import { environment } from '../environment/environment';
import { LanguageService } from '../services/language.service';
import { NewsCategoryGroup, NewsRecord, NewsService } from '../news.service';

@Component({
  selector: 'app-all-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './all-news.component.html',
  styleUrl: './all-news.component.css'
})
export class AllNewsComponent implements OnInit, OnDestroy {
  activeCategoryId: number | null = null;
  categories: NewsCategoryGroup[] = [];
  newsItems: NewsRecord[] = [];
  currentLanguage: 'en' | 'ar' = 'en';
  isLoading = true;
  loadError = false;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly newsService: NewsService,
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

            return this.newsService.getAllGroupedByCategory(language).pipe(
              catchError((error: unknown) => {
                console.error('Failed to load news from the API.', error);
                this.loadError = true;
                return of([]);
              })
            );
          })
        )
        .subscribe((groups) => {
          this.categories = groups;
          this.newsItems = groups.flatMap((group) =>
            group.news.map((item) => ({
              ...item,
              categoryId: group.categoryId,
              categoryNameEn: group.categoryNameEn,
              categoryNameAr: group.categoryNameAr
            }))
          );
          this.isLoading = false;
        })
    );
  }

  get filteredNews(): NewsRecord[] {
    return this.activeCategoryId === null
      ? this.newsItems
      : this.newsItems.filter((item) => item.categoryId === this.activeCategoryId);
  }

  selectCategory(categoryId: number | null): void {
    this.activeCategoryId = categoryId;
  }

  title(item: NewsRecord): string {
    return this.currentLanguage === 'ar'
      ? item.titleAr || item.title || item.titleEn || ''
      : item.titleEn || item.title || item.titleAr || '';
  }

  description(item: NewsRecord): string {
    const description = this.currentLanguage === 'ar'
      ? item.descriptionAr || item.description || item.descriptionEn
      : item.descriptionEn || item.description || item.descriptionAr;
    return description || '';
  }

  categoryName(item: NewsRecord): string {
    return this.currentLanguage === 'ar'
      ? item.categoryNameAr || item.categoryName || item.categoryNameEn || ''
      : item.categoryNameEn || item.categoryName || item.categoryNameAr || '';
  }

  imageUrl(item: NewsRecord): string | null {
    const image = item.images?.find((path) => !!path);
    if (!image) {
      return null;
    }

    const url = new URL(image, `${environment.baseUrl}/`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}