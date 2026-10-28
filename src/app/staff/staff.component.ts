import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription, catchError, combineLatest, of, switchMap } from 'rxjs';
import { FacultyserviceService, ProgramManager } from '../services/facultyservice.service';
import { LanguageService } from '../services/language.service';
import { environment } from '../environment/environment';

@Component({
  selector: 'app-staff',
  imports: [CommonModule],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit, OnDestroy {
  manager?: ProgramManager;
  isLoading = true;
  loadError = false;
  notFound = false;
  isSectorDean = false;

  private readonly subscriptions = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly facultyService: FacultyserviceService,
    public langService: LanguageService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      combineLatest([this.route.paramMap, this.langService.currentLang$])
        .pipe(
          switchMap(([params, language]) => {
            const id = params.get('id');
            this.isSectorDean = this.route.routeConfig?.path === 'staff/dean/:id'
              && id !== null
              && ['1', '2', '3'].includes(id);
            this.manager = undefined;
            this.loadError = false;
            this.notFound = false;
            this.isLoading = true;

            if (!id || !/^\d+$/.test(id)) {
              this.isLoading = false;
              this.notFound = true;
              return of(null);
            }

            const managerRequest = this.isSectorDean
              ? this.facultyService.getSectorDean(id, language)
              : this.facultyService.getProgramManager(id, language);

            return managerRequest.pipe(
              catchError((error: unknown) => {
                console.error(`Failed to load staff profile for ID ${id}.`, error);
                this.loadError = true;
                this.isLoading = false;
                return of(null);
              })
            );
          })
        )
        .subscribe((manager) => {
          this.manager = manager ?? undefined;
          this.notFound = !manager && !this.loadError;
          this.isLoading = false;
        })
    );
  }

  imageUrl(imagePath?: string | null): string | null {
    if (!imagePath) {
      return null;
    }

    const imageUrl = new URL(imagePath, `${environment.baseUrl}/`);
    return imageUrl.protocol === 'http:' || imageUrl.protocol === 'https:'
      ? imageUrl.href
      : null;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
