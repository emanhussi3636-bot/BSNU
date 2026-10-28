import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { NewsService } from '../news.service';
import { LanguageService } from '../services/language.service';
import { NewsDetailsComponent } from './newsdetails.component';

describe('NewsDetailsComponent', () => {
  let fixture: ComponentFixture<NewsDetailsComponent>;

  beforeEach(async () => {
    const newsService = {
      getById: jasmine.createSpy().and.returnValue(of({
        id: 6,
        title: 'API headline',
        description: 'API description',
        subTitle: 'API article text',
        publishedAt: '2026-10-25T00:00:00',
        categoryId: 3,
        categoryName: 'Culture',
        programsId: 4,
        images: [
          'http://bsnudash.runasp.net/images/news/image.jpg',
          'http://bsnudash.runasp.net/images/news/image-2.jpg'
        ]
      }))
    };
    const languageService = {
      currentLang$: of('en'),
      translate: (key: string) => key
    };

    await TestBed.configureTestingModule({
      imports: [NewsDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ id: '6' })) }
        },
        { provide: NewsService, useValue: newsService },
        { provide: LanguageService, useValue: languageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewsDetailsComponent);
    fixture.detectChanges();
  });

  it('renders the generic fields returned by the news detail API', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(fixture.componentInstance.news?.id).toBe(6);
    expect(content).toContain('API headline');
    expect(content).toContain('API description');
    expect(content).toContain('API article text');
    expect(content).toContain('Culture');
    expect(fixture.nativeElement.querySelectorAll('.detail-carousel__indicators button').length).toBe(2);
    expect(fixture.nativeElement.querySelector('img').src)
      .toBe('http://bsnudash.runasp.net/images/news/image.jpg');
  });

  it('navigates through the API image carousel', () => {
    const nextButton = fixture.nativeElement.querySelector(
      '.detail-carousel__control--next'
    ) as HTMLButtonElement;
    nextButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedImageIndex).toBe(1);
    expect(fixture.nativeElement.querySelector('img').src)
      .toBe('http://bsnudash.runasp.net/images/news/image-2.jpg');

    nextButton.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedImageIndex).toBe(0);
  });
});
