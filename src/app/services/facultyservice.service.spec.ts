import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FacultyserviceService } from './facultyservice.service';

describe('FacultyserviceService', () => {
  let service: FacultyserviceService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(FacultyserviceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads faculties through the same-origin API proxy', () => {
    service.getAllFaculties().subscribe((response) => {
      const faculties = Array.isArray(response) ? response : response.value;
      expect(faculties[0].name).toBe('Faculty of Medicine');
    });

    httpTestingController.expectOne('/api/Faculty').flush([
      { id: 1, name: 'Faculty of Medicine', image: null }
    ]);
  });

  it('loads faculties with their programs', () => {
    service.getFacultiesWithPrograms().subscribe((response) => {
      const faculties = Array.isArray(response) ? response : response.value;
      expect(faculties[0].programs[0].id).toBe(41);
    });

    httpTestingController.expectOne('/api/Faculty/with-programs').flush({
      value: [{ id: 1, name: 'Faculty of Medicine', programs: [{ id: 41, name: 'Medicine and Surgery' }] }]
    });
  });

  it('loads faculties when the API returns a plain array', () => {
    service.getFacultiesWithPrograms().subscribe((response) => {
      expect(Array.isArray(response)).toBeTrue();
    });

    httpTestingController.expectOne('/api/Faculty/with-programs').flush([
      { id: 1, name: 'Faculty of Medicine', programs: [{ id: 41, name: 'Medicine and Surgery' }] }
    ]);
  });

  it('loads a program by ID', () => {
    service.getProgram(2).subscribe((program) => {
      expect(program.name).toBe('Pharmacy – Pharm D & Clinical');
      expect(program.programManager?.name).toBe('Rania Sarhan');
    });

    httpTestingController.expectOne('/api/Program/2').flush({
      id: 2,
      name: 'Pharmacy – Pharm D & Clinical',
      programManager: { id: '15', name: 'Rania Sarhan' },
      requirements: [],
      goals: [],
      beneficiaries: [],
      images: [],
      schedules: [],
      events: []
    });
  });

  it('loads the manager for a program ID', () => {
    service.getProgramManager(41).subscribe((manager) => {
      expect(manager.name).toBe('Program Manager');
    });

    httpTestingController.expectOne('/api/Program/41/manager?lang=en').flush({
      id: '12',
      name: 'Program Manager',
      image: null,
      bio: 'Manager biography',
      jobTitle: 'Professor'
    });
  });

  it('loads the dean for a sector ID', () => {
    service.getSectorDean(1).subscribe((dean) => {
      expect(dean.name).toBe('Sector Dean');
    });

    httpTestingController.expectOne('/api/Sector/1/dean?lang=en').flush({
      id: '11',
      name: 'Sector Dean',
      image: null,
      bio: 'Sector dean biography',
      jobTitle: 'Professor'
    });
  });
});
