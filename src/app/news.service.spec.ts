import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NewsService } from './news.service';

describe('NewsService', () => {
  let service: NewsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(NewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads news grouped by category', () => {
    service.getAllGroupedByCategory().subscribe((groups) => {
      expect(groups.length).toBe(1);
      expect(groups[0].news[0].titleEn).toBe('University news');
    });

    httpTestingController
      .expectOne('/api/News/GetAllGroupedByCategory')
      .flush([
        {
          categoryId: 2,
          categoryNameEn: 'Campus',
          categoryNameAr: 'الحرم الجامعي',
          news: [
            {
              id: 1004,
              titleEn: 'University news',
              titleAr: 'أخبار الجامعة',
              descriptionEn: 'Description',
              descriptionAr: 'الوصف',
              subTitleEn: 'Subtitle',
              subTitleAr: 'عنوان فرعي',
              publishedAt: null,
              categoryId: 2,
              categoryNameEn: 'Campus',
              categoryNameAr: 'الحرم الجامعي',
              programsId: 4,
              images: ['/images/news/image.jpeg']
            }
          ]
        }
      ]);
  });

  it('loads news details by ID', () => {
    service.getById(1004).subscribe((news) => {
      expect(news.id).toBe(1004);
      expect(news.titleEn).toBe('University news');
    });

    httpTestingController
      .expectOne('/api/News/GetById/1004')
      .flush({
        id: 1004,
        titleEn: 'University news',
        titleAr: 'أخبار الجامعة',
        descriptionEn: 'Description',
        descriptionAr: 'الوصف',
        subTitleEn: 'Subtitle',
        subTitleAr: 'عنوان فرعي',
        publishedAt: null,
        categoryId: 2,
        categoryNameEn: 'Campus',
        categoryNameAr: 'الحرم الجامعي',
        programsId: 4,
        images: ['/images/news/image.jpeg']
      });
  });
});
