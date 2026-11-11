import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversitySectorsComponent } from './university-sectors.component';
import { LanguageService } from '../services/language.service';

describe('UniversitySectorsComponent', () => {
  let fixture: ComponentFixture<UniversitySectorsComponent>;
  let httpTestingController: HttpTestingController;
  let languageService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniversitySectorsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(UniversitySectorsComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    languageService = TestBed.inject(LanguageService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads localized sectors and programs when the language changes', () => {
    fixture.detectChanges();
    httpTestingController.expectOne('/api/Sector/with-programs?lang=en').flush([
      {
        id: 1,
        name: 'Medical Sector',
        programs: [{ id: 1, name: 'Medicine and Surgery' }]
      }
    ]);
    httpTestingController.expectOne('/api/Sector?lang=en').flush([
      {
        name: 'Medical Sector',
        subTitle: 'Health programs for future professionals.',
        image: 'https://example.com/medical.jpg'
      }
    ]);
    fixture.detectChanges();

    const component = fixture.componentInstance;
    const element = fixture.nativeElement as HTMLElement;
    expect(component.sectors[0].title).toBe('Medical Sector');
    expect(component.sectors[0].subtitle).toBe('Health programs for future professionals.');
    expect(component.sectors[0].image).toBe('https://example.com/medical.jpg');
    expect(component.sectors[0].programs[0].name).toBe('Medicine and Surgery');

    component.selectSector(1);
    fixture.detectChanges();
    expect(element.textContent).toContain('Medicine and Surgery');
    expect(element.querySelector('.program-card')?.getAttribute('href')).toBe('/Program/1');

    languageService.setLanguage('ar');
    fixture.detectChanges();
    httpTestingController.expectOne('/api/Sector/with-programs?lang=ar').flush([
      {
        id: 1,
        name: 'القطاع الطبي',
        programs: [{ id: 1, name: 'الطب والجراحة' }]
      }
    ]);
    httpTestingController.expectOne('/api/Sector?lang=ar').flush([
      {
        name: 'القطاع الطبي',
        subTitle: 'برامج صحية للمتخصصين في المجال الطبي.',
        image: 'https://example.com/medical-ar.jpg'
      }
    ]);
    fixture.detectChanges();

    expect(component.sectors[0].title).toBe('القطاع الطبي');
    expect(component.sectors[0].subtitle).toBe('برامج صحية للمتخصصين في المجال الطبي.');
    expect(component.sectors[0].image).toBe('https://example.com/medical-ar.jpg');
    expect(component.sectors[0].programs[0].name).toBe('الطب والجراحة');

    languageService.setLanguage('en');
    fixture.detectChanges();
    httpTestingController.expectOne('/api/Sector/with-programs?lang=en').flush([
      { id: 1, name: 'Medical Sector', programs: [] }
    ]);
    httpTestingController.expectOne('/api/Sector?lang=en').flush([
      { name: 'Medical Sector', subTitle: '', image: null }
    ]);
    fixture.detectChanges();
    expect(component.sectors[0].image).toBeNull();
    expect(element.querySelector('.sector-card img')).toBeNull();
  });
});
