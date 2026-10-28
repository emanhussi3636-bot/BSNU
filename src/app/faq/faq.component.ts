import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations'; 
import { LanguageService } from '../services/language.service';
interface FAQ {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css',
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})

export class FAQComponent {

  constructor(public langService: LanguageService) {}
currentSlide = 0;
  cardsPerView = 3;

  faqs: FAQ[] = [
    { question: 'FAQ.CARD1.TITLE', answer: 'FAQ.CARD1.DESC' },
    { question: 'FAQ.CARD2.TITLE', answer: 'FAQ.CARD2.DESC' },
    { question: 'FAQ.CARD3.TITLE', answer: 'FAQ.CARD3.DESC' },
    { question: 'FAQ.CARD6.TITLE', answer: 'FAQ.CARD6.DESC' },
    { question: 'FAQ.CARD5.TITLE', answer: 'FAQ.CARD5.DESC' },
    { question: 'FAQ.CARD4.TITLE', answer: 'FAQ.CARD4.DESC' },
    { question: 'FAQ.CARD7.TITLE', answer: 'FAQ.CARD7.DESC' }
  ];

  get visibleCards(): FAQ[] {
    const start = this.currentSlide * this.cardsPerView;
    return this.faqs.slice(start, start + this.cardsPerView);
  }

  get canGoPrevious(): boolean {
    return this.currentSlide > 0;
  }

  get canGoNext(): boolean {
    return (this.currentSlide + 1) * this.cardsPerView < this.faqs.length;
  }

  previousSlide(): void {
    if (this.canGoPrevious) {
      this.currentSlide--;
    }
  }

  nextSlide(): void {
    if (this.canGoNext) {
      this.currentSlide++;
    }
  }
}
