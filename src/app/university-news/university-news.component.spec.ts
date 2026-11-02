import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { NewsService } from '../news.service';
import { LanguageService } from '../services/language.service';
import { UniversityNewsComponent } from './university-news.component';

describe('UniversityNewsComponent', () => {
  let fixture: ComponentFixture<UniversityNewsComponent>;
  let language$: BehaviorSubject<'en' | 'ar'>;
  let newsService: jasmine.SpyObj<NewsService>;

  beforeEach(async () => {
    language$ = new BehaviorSubject<'en' | 'ar'>('en');
    newsService = jasmine.createSpyObj<NewsService>('NewsService', ['getAllGroupedByCategory']);
    newsService.getAllGroupedByCategory.and.callFake((language = 'en') => of([
      {
        categoryId: 4,
        categoryNameEn: 'Sports',
        categoryNameAr: 'رياضة',
        news: [{
          id: 5,
          title: language === 'ar' ? 'عنوان الخبر' : 'API headline',
          titleEn: 'API headline',
          titleAr: 'عنوان الخبر',
          description: language === 'ar' ? 'وصف الخبر' : 'API description',
          descriptionEn: 'API description',
          descriptionAr: 'وصف الخبر',
          subTitle: null,
          subTitleEn: null,
          subTitleAr: null,
          publishedAt: '2026-10-26T00:00:00',
          categoryId: 4,
          categoryName: language === 'ar' ? 'الرياضة' : 'Sports',
          categoryNameEn: 'Sports',
          categoryNameAr: 'رياضة',
          programsId: 4,
          images: ['http://bsnudash.runasp.net/images/news/image.jpeg']
        }]
      }
    ]));
    const languageService = {
      currentLang$: language$.asObservable(),
      translate: (key: string) => key
    };

    await TestBed.configureTestingModule({
      imports: [UniversityNewsComponent],
      providers: [
        provideRouter([]),
        { provide: NewsService, useValue: newsService },
        { provide: LanguageService, useValue: languageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UniversityNewsComponent);
    fixture.detectChanges();
  });

  it('renders only the API news returned, including the API title shape', () => {
    const component = fixture.componentInstance;
    const cards = fixture.nativeElement.querySelectorAll('.xb-blog');

    expect(component.newsItems.length).toBe(1);
    expect(cards.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('API headline');
    expect(component.newsItems[0].description).toBe('API description');
    expect(fixture.nativeElement.textContent).not.toContain('First Employment Fair');
  });

  it('requests and renders the localized API news when Arabic is selected', () => {
    language$.next('ar');
    fixture.detectChanges();

    expect(newsService.getAllGroupedByCategory).toHaveBeenCalledWith('ar');
    expect(fixture.nativeElement.textContent).toContain('عنوان الخبر');
    expect(fixture.nativeElement.textContent).not.toContain('API headline');
  });
});
