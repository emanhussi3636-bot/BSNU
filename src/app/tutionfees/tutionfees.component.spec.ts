import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageService } from '../services/language.service';
import { TutionfeesComponent } from './tutionfees.component';

describe('TutionfeesComponent', () => {
  let fixture: ComponentFixture<TutionfeesComponent>;
  let httpTestingController: HttpTestingController;
  let languageService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutionfeesComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutionfeesComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads bilingual API data and renders the level columns dynamically', () => {
    fixture.detectChanges();
    httpTestingController.expectOne('/api/TuitionFees?lang=en').flush({
      value: [{
        id: 8,
        programsId: 6,
        programNameEn: 'Artificial intelligence',
        programNameAr: 'الذكاء الاصطناعي',
        facultyNameEn: 'Faculty of Computers and Artificial Intelligence',
        facultyNameAr: 'كلية الحاسبات والذكاء الاصطناعي',
        sectorNameEn: 'Engineering Sector',
        sectorNameAr: 'قطاع الهندسة',
        displayOrder: 0,
        levels: [
          { id: 10, levelNumber: 1, feeAmount: 5000, academicYear: '2026' },
          { id: 11, levelNumber: 5, feeAmount: 7250, academicYear: '2026' }
        ]
      }],
      Count: 1
    });
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const element = fixture.nativeElement as HTMLElement;
    expect(component.tuitionFees.length).toBe(1);
    expect(component.levelColumns.map((column) => column.levelNumber)).toEqual([1, 5]);
    expect(element.textContent).toContain('Artificial intelligence');
    expect(element.textContent).toContain('Engineering Sector');
    expect(element.textContent).toContain('5,000 EGP');
    expect(element.textContent).toContain('7,250 EGP');

    languageService.setLanguage('ar');
    fixture.detectChanges();
    httpTestingController.expectOne('/api/TuitionFees?lang=ar').flush({
      value: [{
        id: 8,
        programsId: 6,
        programNameEn: 'Artificial intelligence',
        programNameAr: 'الذكاء الاصطناعي',
        facultyNameEn: 'Faculty of Computers and Artificial Intelligence',
        facultyNameAr: 'كلية الحاسبات والذكاء الاصطناعي',
        sectorNameEn: 'Engineering Sector',
        sectorNameAr: 'قطاع الهندسة',
        displayOrder: 0,
        levels: [
          { id: 10, levelNumber: 1, feeAmount: 5000, academicYear: '2026' },
          { id: 11, levelNumber: 5, feeAmount: 7250, academicYear: '2026' }
        ]
      }],
      Count: 1
    });
    fixture.detectChanges();

    expect(component.dir).toBe('rtl');
    expect(element.textContent).toContain('الذكاء الاصطناعي');
    expect(element.textContent).toContain('قطاع الهندسة');
    expect(element.textContent).toContain('٥٬٠٠٠ جنيه');
  });
});
