import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription, catchError, forkJoin, of, switchMap } from 'rxjs';
import { FacultyserviceService } from '../services/facultyservice.service';
import { LanguageService } from '../services/language.service';

interface Program {
  id: number | string;
  name: string;
}

interface Sector {
  id: number | string;
  title: string;
  subtitle: string;
  image: string | null;
  programs: Program[];
}

@Component({
  selector: 'app-university-sectors',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './university-sectors.component.html',
  styleUrls: ['./university-sectors.component.css']
})
export class UniversitySectorsComponent implements OnInit, OnDestroy {
  selectedSectorId: number | string | null = null;
  sectors: Sector[] = [];
  isLoading = true;
  loadError = false;
  private readonly subscriptions = new Subscription();

  constructor(
    public langService: LanguageService,
    private readonly facultyService: FacultyserviceService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.langService.currentLang$.pipe(
        switchMap((language) => {
          this.isLoading = true;
          this.loadError = false;
          this.sectors = [];

          return forkJoin({
            sectors: this.facultyService.getSectors(language),
            sectorsWithPrograms: this.facultyService.getSectorsWithPrograms(language)
          }).pipe(
            catchError((error: unknown) => {
              console.error('Failed to load university sectors.', error);
              this.loadError = true;
              this.isLoading = false;
              this.selectedSectorId = null;
              return of({ sectors: [], sectorsWithPrograms: [] });
            })
          );
        })
      ).subscribe(({ sectors, sectorsWithPrograms }) => {
        this.sectors = sectorsWithPrograms.map((record, index) => {
          const sectorDetails = sectors.find(
            (sector) => this.normalizeName(sector.name) === this.normalizeName(record.name)
          ) ?? sectors[index];
          return {
            id: record.id,
            title: sectorDetails?.name ?? record.name,
            subtitle: sectorDetails?.subTitle ?? '',
            image: sectorDetails?.image || null,
            programs: record.programs ?? []
          };
        });
        this.isLoading = false;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get selectedSector(): Sector | undefined {
    return this.sectors.find((sector) => sector.id === this.selectedSectorId);
  }

  selectSector(sectorId: number | string): void {
    this.selectedSectorId = this.selectedSectorId === sectorId ? null : sectorId;
  }

  private normalizeName(name: string): string {
    return name.trim().toLocaleLowerCase();
  }

}
