import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { FacultyserviceService } from '../services/facultyservice.service';
import { LanguageService } from '../services/language.service';
import { CoursesDetailsComponent } from './courses-details.component';

describe('CoursesDetailsComponent', () => {
  let fixture: ComponentFixture<CoursesDetailsComponent>;

  beforeEach(async () => {
    const facultyService = {
      getProgram: jasmine.createSpy().and.returnValue(of({
        id: 2,
        name: 'API program name',
        description: 'API program summary',
        duration: 'Five years',
        studySystem: 'Credit hours',
        creditHours: '191',
        academicDegree: 'Bachelor degree',
        jobTitles: 'Pharmacist',
        mission: 'API mission',
        vision: 'API vision',
        programManager: {
          id: '15',
          name: 'API manager',
          title: 'Professor',
          image: 'http://bsnudash.runasp.net/assets/program/manager.jpg',
          bio: 'Manager biography'
        },
        goals: [{ id: 1, description: 'API goal' }],
        beneficiaries: [{ id: 1, description: 'API beneficiary' }],
        requirements: [{ id: 1, requirementName: 'API requirement', totalHours: 18 }],
        images: [
          { id: 1, imagePath: 'http://bsnudash.runasp.net/images/programs/one.jpg' },
          { id: 2, imagePath: 'http://bsnudash.runasp.net/images/programs/two.jpg' }
        ],
        schedules: [{ id: 1, fileName: 'http://bsnudash.runasp.net/schedules/year-one.pdf' }],
        events: [{
          id: 1,
          title: 'API event',
          description: 'Event details',
          images: [{ id: 1, imagePath: 'http://bsnudash.runasp.net/images/events/event.jpg' }]
        }]
      }))
    };
    const languageService = {
      currentLang$: of('en'),
      translate: (key: string) => key
    };

    await TestBed.configureTestingModule({
      imports: [CoursesDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { paramMap: of(convertToParamMap({ id: '2' })) } },
        { provide: FacultyserviceService, useValue: facultyService },
        { provide: LanguageService, useValue: languageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesDetailsComponent);
    fixture.detectChanges();
  });

  it('renders program details and images from the API response', () => {
    const content = fixture.nativeElement.textContent as string;

    expect(fixture.componentInstance.program?.id).toBe(2);
    expect(content).toContain('API program name');
    expect(content).toContain('API program summary');
    expect(content).toContain('API mission');
    expect(content).toContain('API goal');
    expect(content).toContain('API beneficiary');
    expect(content).toContain('API requirement');
    expect(content).toContain('API manager');
    expect(content).toContain('Professor');
    expect(content).toContain('Manager biography');
    expect(content).toContain('API event');
    expect(fixture.nativeElement.querySelectorAll('.course-details__event').length).toBe(1);
    const contentArea = fixture.nativeElement.querySelector('.course-details__content') as HTMLElement;
    const contentPanels: HTMLElement[] = Array.from(
      contentArea.querySelectorAll<HTMLElement>(':scope > .course-details__panel')
    );
    const managerPanelIndex = contentPanels.findIndex((panel) => panel.classList.contains('course-details__panel--manager'));
    const missionPanelIndex = contentPanels.findIndex((panel) => panel.textContent?.includes('API mission'));
    expect(managerPanelIndex).toBeGreaterThanOrEqual(0);
    expect(managerPanelIndex).toBeLessThan(missionPanelIndex);
    expect(fixture.nativeElement.querySelectorAll('.course-details__requirements-table tbody tr').length).toBe(1);
    expect(fixture.nativeElement.querySelector('.course-details__requirements-table tbody tr').textContent)
      .toContain('API requirement');
    expect(fixture.nativeElement.querySelector('.course-details__requirements-table tbody tr').textContent)
      .toContain('18');
    expect(fixture.nativeElement.querySelector('a.download-link').href)
      .toBe('http://bsnudash.runasp.net/schedules/year-one.pdf');
  });

  it('renders the program API images in the sidebar image section', () => {
    const images = fixture.nativeElement.querySelectorAll('.course-details__program-images img');

    expect(images.length).toBe(2);
    expect((images[0] as HTMLImageElement).src)
      .toBe('http://bsnudash.runasp.net/images/programs/one.jpg');
    expect((images[1] as HTMLImageElement).src)
      .toBe('http://bsnudash.runasp.net/images/programs/two.jpg');
  });

  it('changes the displayed program image with carousel controls', () => {
    fixture.componentInstance.showNextImage();
    fixture.detectChanges();

    expect(fixture.componentInstance.currentImageIndex).toBe(1);
    expect(fixture.nativeElement.querySelector('.course-details__hero').style.backgroundImage)
      .toContain('two.jpg');
  });
});
