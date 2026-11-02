import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { VicePresidentComponent } from './vice-president.component';

describe('VicePresidentComponent', () => {
  let fixture: ComponentFixture<VicePresidentComponent>;
  let httpTestingController: HttpTestingController;
  let routeParamMap: BehaviorSubject<ParamMap>;
  let langService: LanguageService;

  beforeEach(async () => {
    routeParamMap = new BehaviorSubject(convertToParamMap({ id: 'Presitent' }));

    await TestBed.configureTestingModule({
      imports: [VicePresidentComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: routeParamMap.asObservable() } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VicePresidentComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    langService = TestBed.inject(LanguageService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads a university user using the route role name', () => {
    const request = httpTestingController.expectOne(
      (candidate) => candidate.url === '/api/Users/byrole'
        && candidate.params.get('roleName') === 'President'
        && candidate.params.get('lang') === 'en'
    );
    request.flush({
      id: '105',
      description: 'University President',
      jobTitle: 'President of Beni Suef National University',
      fullName: 'Tarek Ali',
      bio: 'API biography',
      imagePath: 'http://bsnudash.runasp.net/assets/vice_president/drtarek.jpeg'
    });
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent as string;
    expect(content).toContain('Tarek Ali');
    expect(content).toContain('University President');
    expect(content).toContain('President of Beni Suef National University');
    expect(content).toContain('API biography');
    expect(fixture.nativeElement.querySelector('img').src)
      .toBe('http://bsnudash.runasp.net/assets/vice_president/drtarek.jpeg');
    expect(fixture.nativeElement.querySelector('iframe')).not.toBeNull();
  });

  it('requests a new user when the route role changes', () => {
    httpTestingController.expectOne(
      (candidate) => candidate.url === '/api/Users/byrole'
        && candidate.params.get('roleName') === 'President'
        && candidate.params.get('lang') === 'en'
    ).flush({ id: '5', fullName: 'President' });

    routeParamMap.next(convertToParamMap({ id: 'AffairsLead' }));
    httpTestingController.expectOne(
      (candidate) => candidate.url === '/api/Users/byrole'
        && candidate.params.get('roleName') === 'AffairsLead'
        && candidate.params.get('lang') === 'en'
    ).flush({ id: '4', fullName: 'Basem Anwar' });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Basem Anwar');
  });

  it('reloads localized user details when the language changes', () => {
    httpTestingController.expectOne(
      (candidate) => candidate.url === '/api/Users/byrole'
        && candidate.params.get('roleName') === 'President'
        && candidate.params.get('lang') === 'en'
    ).flush({
      id: '5',
      fullNameEn: 'Tarek Ali',
      fullNameAr: 'طارق علي'
    });

    langService.setLanguage('ar');
    httpTestingController.expectOne(
      (candidate) => candidate.url === '/api/Users/byrole'
        && candidate.params.get('roleName') === 'President'
        && candidate.params.get('lang') === 'ar'
    ).flush({
      id: '5',
      fullNameEn: 'Tarek Ali',
      fullNameAr: 'طارق علي'
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('طارق علي');
    expect(fixture.nativeElement.textContent).not.toContain('Tarek Ali');
  });
});
