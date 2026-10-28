import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../services/language.service';

interface Program {
  id: string;
  name: string;
  link: string;
}

interface Sector {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  programs: Program[];
}

@Component({
  selector: 'app-university-sectors',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './university-sectors.component.html',
  styleUrls: ['./university-sectors.component.css']
})
export class UniversitySectorsComponent implements OnInit {
  selectedSectorId: string | null = null;
  sectors: Sector[] = [];

  constructor(public langService: LanguageService) {}

  ngOnInit(): void {
    this.langService.currentLang$.subscribe(() => {
      const data = this.langService.getCurrentLanguageData();
      this.loadSectors(data);
    });
  }

  get selectedSector(): Sector | undefined {
    return this.sectors.find((sector) => sector.id === this.selectedSectorId);
  }

  selectSector(sectorId: string): void {
    this.selectedSectorId = this.selectedSectorId === sectorId ? null : sectorId;
  }

  private loadSectors(data: any): void {
    const translations = data?.universitySectors || {};

    this.sectors = [
      {
        id: 'medical',
        title: translations.SECTORS?.['medical']?.TITLE || 'Medical Sector',
        subtitle: translations.SECTORS?.['medical']?.SUBTITLE || 'Health programs for future medical professionals.',
        image: 'assets/program/medicine.jpg',
        programs: [
          { id: 'medicine', name: translations.PROGRAMS?.['medicine'] || 'Medicine and Surgery', link: '/medicine' },
          { id: 'pharmacy', name: translations.PROGRAMS?.['pharmacy'] || 'Pharm D & clinical', link: '/pharmacy-program' },
          { id: 'dentistry', name: translations.PROGRAMS?.['dentistry'] || 'Dentistry And Oral & Maxillofacial Surgery', link: '/dental-program' },
          { id: 'physical-therapy', name: translations.PROGRAMS?.['physical-therapy'] || 'Physical Therapy', link: '/physical-therapy' },
          { id: 'nursing', name: translations.PROGRAMS?.['nursing'] || 'Nursing', link: '/nursing-program' }
        ]
      },
      {
        id: 'engineering',
        title: translations.SECTORS?.['engineering']?.TITLE || 'Engineering Sector',
        subtitle: translations.SECTORS?.['engineering']?.SUBTITLE || 'Innovative engineering programs for tomorrow’s builders.',
        image: 'assets/program/programs/engineering.jpg',
        programs: [
          { id: 'cyber-security', name: translations.PROGRAMS?.['cyber-security'] || 'Cybersecurity', link: '/home' },
          { id: 'medical-informatics', name: translations.PROGRAMS?.['medical-informatics'] || 'Medical Informatics', link: '/medical-informatics' },
          { id: 'ai', name: translations.PROGRAMS?.['ai'] || 'Artificial Intelligence', link: '/ai' },
          { id: 'biochemistry', name: translations.PROGRAMS?.['biochemistry'] || 'Biochemistry and Microbiology', link: '/bio-program' },
          { id: 'industrial-chemistry', name: translations.PROGRAMS?.['industrial-chemistry'] || 'Industrial Chemistry', link: '/industrial-program' },
          { id: 'petroleum-geology', name: translations.PROGRAMS?.['petroleum-geology'] || 'Petroleum Geology and Mining', link: '/PetroleumMining-program' },
          { id: 'navigation-space', name: translations.PROGRAMS?.['navigation-space'] || 'Applied Sciences for Space and Navigation', link: '/NavigSciences-program' },
          { id: 'engineering', name: translations.PROGRAMS?.['engineering'] || 'Engineering', link: '/engneering-program' }
        ]
      },
      {
        id: 'education-humanities',
        title: translations.SECTORS?.['education-humanities']?.TITLE || 'Education & Humanities Sector',
        subtitle: translations.SECTORS?.['education-humanities']?.SUBTITLE || 'Programs that support community, law, and media development.',
        image: 'assets/program/programs/humanitation.jpg',
        programs: [
          { id: 'clinical-psychology', name: translations.PROGRAMS?.['clinical-psychology'] || 'Clinical Psychology', link: '/clinical-program' },
          { id: 'gis', name: translations.PROGRAMS?.['gis'] || 'Surveying, Mapping, GIS', link: '/gis-program' },
          { id: 'archive', name: translations.PROGRAMS?.['archive'] || 'Information Systems and Electronic Archiving', link: '/archive-program' },
          { id: 'digital-journalism', name: translations.PROGRAMS?.['digital-journalism'] || 'Digital and Television Journalism', link: '/digital-journalism' },
          { id: 'television', name: translations.PROGRAMS?.['television'] || 'Television and Film Production', link: '/television-and-film-production' },
          { id: 'law', name: translations.PROGRAMS?.['law'] || 'Legal Studies', link: '/law-program' },
          { id: 'commerce', name: translations.PROGRAMS?.['commerce'] || 'International Accounting and Finance', link: '/commerce-program' }
        ]
      }
    ];
  }
}
