import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { NewsCategoryGroup, NewsService } from '../news.service';
import { LanguageService } from '../services/language.service';
import { AllNewsComponent } from './all-news.component';

describe('AllNewsComponent', () => {
  let fixture: ComponentFixture<AllNewsComponent>;
  let language$: BehaviorSubject<'en' | 'ar'>;
  let newsService: jasmine.SpyObj<NewsService>;

  beforeEach(async () => {
    language$ = new BehaviorSubject<'en' | 'ar'>('en');
    newsService = jasmine.createSpyObj<NewsService>('NewsService', ['getAllGroupedByCategory']);
    newsService.getAllGroupedByCategory.and.callFake((language = 'en') => of([
      {
        categoryId: 2,
        categoryNameEn: 'Campus',
        categoryNameAr: 'الحرم الجامعي',
        news: [{
          id: 13,
          title: language === 'ar' ? 'عنوان عربي' : 'English title',
          titleEn: 'English title',
          titleAr: 'عنوان عربي',
          description: language === 'ar' ? 'وصف عربي' : 'English description',
          descriptionEn: 'English description',
          descriptionAr: 'وصف عربي',
          publishedAt: null,
          categoryId: 2,
          categoryName: language === 'ar' ? 'الحرم الجامعي' : 'Campus',
          categoryNameEn: 'Campus',
          categoryNameAr: 'الحرم الجامعي',
          programsId: null,
          images: []
        }]
      }
    ] satisfies NewsCategoryGroup[]));

    await TestBed.configureTestingModule({
      imports: [AllNewsComponent],
      providers: [
        provideRouter([]),
        { provide: NewsService, useValue: newsService },
        {
          provide: LanguageService,
          useValue: {
            currentLang$: language$.asObservable(),
            translate: (key: string) => key
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AllNewsComponent);
    fixture.detectChanges();
  });

  it('reloads news and displays localized API values when the language changes', () => {
    expect(newsService.getAllGroupedByCategory).toHaveBeenCalledWith('en');
    expect(fixture.nativeElement.textContent).toContain('English title');

    language$.next('ar');
    fixture.detectChanges();

    expect(newsService.getAllGroupedByCategory).toHaveBeenCalledWith('ar');
    expect(fixture.nativeElement.textContent).toContain('عنوان عربي');
    expect(fixture.nativeElement.textContent).toContain('وصف عربي');
    expect(fixture.nativeElement.textContent).not.toContain('English title');
  });
});
