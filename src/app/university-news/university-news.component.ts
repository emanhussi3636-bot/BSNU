import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of, Subscription, switchMap } from 'rxjs';
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
  isLoading = true;
  loadError = false;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly newsService: NewsService,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$.pipe(
        switchMap((language) => {
          this.isLoading = true;
          this.loadError = false;

          return this.newsService.getAllGroupedByCategory(language).pipe(
            map((groups) =>
              groups.flatMap((group) =>
                group.news.map((news) => ({
                  news,
                  categoryName: news.categoryName
                    || (language === 'ar' ? group.categoryNameAr : group.categoryNameEn)
                    || ''
                }))
              )
                .sort((left, right) => this.newsTime(right.news) - this.newsTime(left.news))
                .slice(0, 5)
                .map(({ news, categoryName }) => ({
                  id: news.id,
                  image: this.imageUrl(news) ?? '',
                  title: news.title || '',
                  description: news.description || '',
                  category: categoryName
                }))
            ),
            catchError((error: unknown) => {
              console.error('Failed to load university news.', error);
              this.loadError = true;
              return of([]);
            })
          );
        })
      ).subscribe((newsItems) => {
        this.newsItems = newsItems;
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private newsTime(news: NewsRecord): number {
    const time = news.publishedAt ? new Date(news.publishedAt).getTime() : 0;
    return Number.isNaN(time) ? news.id : time;
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
