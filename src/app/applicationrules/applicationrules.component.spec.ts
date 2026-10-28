import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ApplicationrulesComponent } from './applicationrules.component';
import { LanguageService } from '../services/language.service';

describe('ApplicationrulesComponent', () => {
  let component: ApplicationrulesComponent;
  let fixture: ComponentFixture<ApplicationrulesComponent>;
  let httpTestingController: HttpTestingController;
  let langService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationrulesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApplicationrulesComponent);
    component = fixture.componentInstance;
    httpTestingController = TestBed.inject(HttpTestingController);
    langService = TestBed.inject(LanguageService);
    httpTestingController.expectOne((request) =>
      request.url === '/api/ApplicationRules' &&
      request.params.get('lang') === 'en'
    ).flush([
      {
        id: 1,
        label: 'Egyptian Thanaweya Amma',
        heading: 'Egyptian Thanaweya Amma Students',
        description: 'Required documents',
        documents: [{ id: 1, item: 'Original certificate' }]
      }
    ]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders categories and documents from the API response', () => {
    expect(fixture.nativeElement.textContent).toContain('Egyptian Thanaweya Amma');
    expect(fixture.nativeElement.textContent).toContain('Original certificate');
  });

  it('requests localized rules from the API when the language changes', () => {
    langService.setLanguage('ar');
    httpTestingController.expectOne((request) =>
      request.url === '/api/ApplicationRules' &&
      request.params.get('lang') === 'ar'
    ).flush([
      {
        id: 1,
        label: 'الثانوية العامة المصرية',
        heading: 'طلاب الثانوية العامة المصرية',
        description: 'المستندات المطلوبة',
        documents: [{ id: 1, item: 'الشهادة الأصلية' }]
      }
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('الشهادة الأصلية');
  });
});
