import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../environment/environment';
import { NewsRecord, NewsService } from '../news.service';
import { LanguageService } from '../services/language.service';

interface UniversityNewsItem {
  id: number | string;
  image: string;
  title: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-university-news',
  imports: [CommonModule, RouterLink],
  templateUrl: './university-news.component.html',
  styleUrl: './university-news.component.css'
})
export class UniversityNewsComponent implements OnInit, OnDestroy {
  newsItems: UniversityNewsItem[] = [];
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
        this.updateNewsTitles();
      })
    );

    this.subscriptions.add(
      this.newsService.getAllGroupedByCategory().subscribe({
        next: (groups) => {
          const apiNews = groups.flatMap((group) =>
            group.news.map((news) => ({
              ...news,
              categoryId: group.categoryId,
              categoryNameEn: group.categoryNameEn,
              categoryNameAr: group.categoryNameAr
            }))
          );

          const latestNews = apiNews
            .sort((left, right) => this.newsTime(right) - this.newsTime(left))
            .slice(0, 5);

          this.apiNews = latestNews;
          this.updateNewsTitles();
          this.isLoading = false;
          this.loadError = false;
        },
        error: (error: unknown) => {
          console.error('Failed to load university news.', error);
          this.apiNews = [];
          this.newsItems = [];
          this.loadError = true;
          this.isLoading = false;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private apiNews: NewsRecord[] = [];

  private newsTime(news: NewsRecord): number {
    const time = news.publishedAt ? new Date(news.publishedAt).getTime() : 0;
    return Number.isNaN(time) ? news.id : time;
  }

  private updateNewsTitles(): void {
    this.newsItems = this.apiNews.map((news) => ({
      id: news.id,
      image: this.imageUrl(news) ?? '',
      title: this.currentLanguage === 'ar'
        ? news.titleAr || news.titleEn || news.title || ''
        : news.titleEn || news.titleAr || news.title || '',
      description: this.currentLanguage === 'ar'
        ? news.descriptionAr || news.descriptionEn || news.description || ''
        : news.descriptionEn || news.descriptionAr || news.description || '',
      category: this.currentLanguage === 'ar'
        ? news.categoryNameAr || news.categoryNameEn || news.categoryName || ''
        : news.categoryNameEn || news.categoryNameAr || news.categoryName || ''
    }));
  }

  private imageUrl(news: NewsRecord): string | null {
    const image = news.images?.find((path) => !!path);
    if (!image) {
      return null;
    }

    const url = new URL(image, `${environment.baseUrl}/`);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.href : null;
  }
}
