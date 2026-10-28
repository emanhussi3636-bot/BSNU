import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
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
      this.langService.currentLang$.subscribe((language) => {
        this.currentLanguage = language;
      })
    );

    this.subscriptions.add(
      this.newsService.getAllGroupedByCategory().subscribe({
        next: (groups) => {
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
        },
        error: (error: unknown) => {
          console.error('Failed to load news from the API.', error);
          this.loadError = true;
          this.isLoading = false;
        }
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
      ? item.titleAr || item.titleEn
      : item.titleEn || item.titleAr;
  }

  description(item: NewsRecord): string {
    const description = this.currentLanguage === 'ar'
      ? item.descriptionAr || item.descriptionEn
      : item.descriptionEn || item.descriptionAr;
    return description || '';
  }

  categoryName(item: NewsRecord): string {
    return this.currentLanguage === 'ar'
      ? item.categoryNameAr || item.categoryNameEn
      : item.categoryNameEn || item.categoryNameAr;
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