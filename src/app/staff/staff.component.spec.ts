import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap, convertToParamMap } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LanguageService } from '../services/language.service';
import { StaffComponent } from './staff.component';

describe('StaffComponent', () => {
  let fixture: ComponentFixture<StaffComponent>;
  let httpTestingController: HttpTestingController;
  let routeParamMap: BehaviorSubject<ParamMap>;
  let routeConfig: { path: string };

  beforeEach(async () => {
    routeParamMap = new BehaviorSubject(convertToParamMap({ id: '41' }));
    routeConfig = { path: 'staff/:id' };

    await TestBed.configureTestingModule({
      imports: [StaffComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ActivatedRoute, useValue: { paramMap: routeParamMap.asObservable(), routeConfig } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffComponent);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads and displays the program manager from the API', () => {
    httpTestingController.expectOne('/api/Program/41/manager?lang=en').flush({
      id: '12',
      name: 'Doaa Ahmed Hamdy',
      image: null,
      bio: 'Program manager biography',
      jobTitle: 'Professor'
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Doaa Ahmed Hamdy');
    expect(text).toContain('Professor');
    expect(text).toContain('Program manager biography');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('uses the dean API only on the dean route for sector IDs 1, 2, and 3', () => {
    httpTestingController.expectOne('/api/Program/41/manager?lang=en').flush({
      id: '12',
      name: 'Program Manager'
    });

    for (const sectorId of ['1', '2', '3']) {
      routeParamMap.next(convertToParamMap({ id: sectorId }));
      httpTestingController.expectOne(`/api/Program/${sectorId}/manager?lang=en`).flush({
        id: sectorId,
        name: `Program ${sectorId} Manager`
      });
    }

    routeConfig.path = 'staff/dean/:id';
    for (const sectorId of ['1', '2', '3']) {
      routeParamMap.next(convertToParamMap({ id: sectorId }));
      httpTestingController.expectOne(`/api/Sector/${sectorId}/dean?lang=en`).flush({
        id: sectorId,
        name: `Sector ${sectorId} Dean`
      });
    }

    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Sector 3 Dean');
    expect(fixture.nativeElement.querySelector('h3')?.textContent).toContain('Dean');

    routeParamMap.next(convertToParamMap({ id: '4' }));
    httpTestingController.expectOne('/api/Program/4/manager?lang=en').flush({
      id: '4',
      name: 'Program 4 Manager'
    });
  });

  it('reloads localized profile data when the site language changes', () => {
    httpTestingController.expectOne('/api/Program/41/manager?lang=en').flush({
      id: '12',
      name: 'Doaa Ahmed Hamdy',
      bio: 'English biography',
      jobTitle: 'Professor'
    });

    TestBed.inject(LanguageService).setLanguage('ar');
    httpTestingController.expectOne('/api/Program/41/manager?lang=ar').flush({
      id: '12',
      name: 'دعاء أحمد حمدي',
      bio: 'السيرة الذاتية بالعربية',
      jobTitle: 'أستاذة'
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('دعاء أحمد حمدي');
    expect(text).toContain('السيرة الذاتية بالعربية');
    expect(text).toContain('أستاذة');
  });

  it('requests localized dean data for sector IDs', () => {
    httpTestingController.expectOne('/api/Program/41/manager?lang=en').flush({
      id: '12',
      name: 'Program Manager'
    });

    routeConfig.path = 'staff/dean/:id';
    routeParamMap.next(convertToParamMap({ id: '1' }));
    httpTestingController.expectOne('/api/Sector/1/dean?lang=en').flush({
      id: '11',
      name: 'Sector Dean',
      bio: 'English dean bio'
    });

    TestBed.inject(LanguageService).setLanguage('ar');
    httpTestingController.expectOne('/api/Sector/1/dean?lang=ar').flush({
      id: '11',
      name: 'عميد القطاع',
      bio: 'السيرة الذاتية للعميد'
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('عميد القطاع');
    expect(fixture.nativeElement.textContent).toContain('السيرة الذاتية للعميد');
  });
});
