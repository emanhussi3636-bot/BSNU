import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TuitionFeesService } from './tuition-fees.service';

describe('TuitionFeesService', () => {
  let service: TuitionFeesService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TuitionFeesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('loads and unwraps tuition fees for the requested language', () => {
    service.getTuitionFees('ar').subscribe((records) => {
      expect(records.length).toBe(1);
      expect(records[0].programNameAr).toBe('الذكاء الاصطناعي');
      expect(records[0].levels?.[0].feeAmount).toBe(5000);
    });

    httpTestingController.expectOne('/api/TuitionFees?lang=ar').flush({
      value: [{
        id: 8,
        programsId: 6,
        programNameEn: 'Artificial intelligence',
        programNameAr: 'الذكاء الاصطناعي',
        facultyNameEn: null,
        facultyNameAr: null,
        sectorNameEn: 'Engineering Sector',
        sectorNameAr: 'قطاع الهندسة',
        displayOrder: 0,
        levels: [{ id: 10, levelNumber: 1, feeAmount: 5000, academicYear: '2026' }]
      }],
      Count: 1
    });
  });
});
