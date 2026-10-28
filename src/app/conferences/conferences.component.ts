import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

interface ConferenceGalleryItem {
  id: number;
  titleKey: string;
  subtitleKey: string;
  snippetKey: string;
  detailKey: string;
  image: string;
  date: string;
  locationKey: string;
  typeKey: string;
}

@Component({
  selector: 'app-conferences',
  imports: [NgFor],
  templateUrl: './conferences.component.html',
  styleUrl: './conferences.component.css'
})
export class ConferencesComponent {
  conferenceGalleries: ConferenceGalleryItem[] = [
    {
      id: 1,
      titleKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.TITLE',
      subtitleKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.SUBTITLE',
      snippetKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.SNIPPET',
      detailKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.DETAIL',
      image: '/assets/event/مناخ1.jpg',
      date: 'June 5, 2026',
      locationKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.LOCATION',
      typeKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.TYPE'
    },
    {
      id: 2,
      titleKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.TITLE',
      subtitleKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.SUBTITLE',
      snippetKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.SNIPPET',
      detailKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.DETAIL',
      image: '/assets/news/ملتقي1.jpg',
      date: 'July 14, 2026',
      locationKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.LOCATION',
      typeKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.TYPE'
    },
    {
      id: 3,
      titleKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.TITLE',
      subtitleKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.SUBTITLE',
      snippetKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.SNIPPET',
      detailKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.DETAIL',
      image: '/assets/news/وفد_معهد_الاورام.jpg',
      date: 'August 22, 2026',
      locationKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.LOCATION',
      typeKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.TYPE'
    },
    {
      id: 4,
      titleKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.TITLE',
      subtitleKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.SUBTITLE',
      snippetKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.SNIPPET',
      detailKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.DETAIL',
      image: '/assets/event/توقيع1.jpg',
      date: 'September 10, 2026',
      locationKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.LOCATION',
      typeKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.TYPE'
    }
  ];

  touchActiveCardId: number | null = null;
  touchClearTimeout: number | null = null;
  touchClickSuppressed = false;

  constructor(private router: Router, public langService: LanguageService) {}

  updatePointer(event: PointerEvent, card: HTMLElement): void {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--pointer-x', `${x}%`);
    card.style.setProperty('--pointer-y', `${y}%`);
  }

  resetPointer(card: HTMLElement): void {
    card.style.setProperty('--pointer-x', '50%');
    card.style.setProperty('--pointer-y', '50%');
    card.classList.remove('touch-active');
    this.touchActiveCardId = null;
    this.touchClickSuppressed = false;
    if (this.touchClearTimeout) {
      window.clearTimeout(this.touchClearTimeout);
      this.touchClearTimeout = null;
    }
  }

  onCardPointerDown(event: PointerEvent, itemId: number, card: HTMLElement): void {
    if (event.pointerType === 'touch' || event.pointerType === 'pen') {
      if (this.touchActiveCardId === itemId) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      this.touchActiveCardId = itemId;
      this.touchClickSuppressed = true;
      card.classList.add('touch-active');

      if (this.touchClearTimeout) {
        window.clearTimeout(this.touchClearTimeout);
      }
      this.touchClearTimeout = window.setTimeout(() => {
        card.classList.remove('touch-active');
        this.touchActiveCardId = null;
        this.touchClickSuppressed = false;
        this.touchClearTimeout = null;
      }, 1500);
    }
  }

  openDetail(id: number, event: Event): void {
    if (this.touchClickSuppressed && this.touchActiveCardId === id) {
      this.touchClickSuppressed = false;
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (this.touchActiveCardId === id) {
      this.touchActiveCardId = null;
      this.touchClickSuppressed = false;
    }

    this.router.navigate(['/gallery-conferences', id]);
  }
}
