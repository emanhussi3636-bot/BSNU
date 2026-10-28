import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { VicePresidentService } from './vice-president.service';

describe('VicePresidentService', () => {
  let service: VicePresidentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(VicePresidentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('requests a user by role name', () => {
    service.getUserByRole('VicePresidentAcademic').subscribe((user) => {
      expect(user.fullName).toBe('Rasha Mohamed Tawfiq');
    });

    const request = httpTestingController.expectOne(
      (candidate) => candidate.url === '/api/Users/byrole'
        && candidate.params.get('roleName') === 'VicePresidentAcademic'
    );
    request.flush({
      id: '2',
      fullName: 'Rasha Mohamed Tawfiq',
      jobTitle: 'Vice President of the University for Academic Affairs',
      description: 'Vice President of the University'
    });
  });
});
