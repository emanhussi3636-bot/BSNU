import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LanguageService } from '../services/language.service';

interface ConferenceGalleryItem {
  id: number;
  titleKey: string;
  subtitleKey: string;
  snippetKey: string;
  detailKey: string;
  image: string[];
  date: string;
  locationKey: string;
  typeKey: string;
}

@Component({
  selector: 'app-gallery-conferences',
  imports: [NgIf, NgFor],
  templateUrl: './gallery-conferences.component.html',
  styleUrl: './gallery-conferences.component.css'
})
export class GalleryConferencesComponent implements OnInit {
  galleryItems: ConferenceGalleryItem[] = [
    {
      id: 1,
      titleKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.TITLE',
      subtitleKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.SUBTITLE',
      snippetKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.SNIPPET',
      detailKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.DETAIL',
      image: ['/assets/event/مناخ2.jpg','/assets/event/مناخ1.jpg','/assets/event/مناخ3.jpg','/assets/event/مناخ4.jpg'],
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
      image: ['/assets/news/ملتقي1.jpg','/assets/news/ملتقي2.jpg','/assets/news/ملتقي3.jpg','/assets/news/ملتقي توظيفي.jpg'],
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
      image: ['/assets/news/وفد_معهد_الاورام.jpg'],
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
      image: ['/assets/event/توقيع1.jpg','/assets/event/توقيع3.jpg','/assets/event/توقبع2.jpg'],
      date: 'September 10, 2026',
      locationKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.LOCATION',
      typeKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.TYPE'
    }
  ];

  selectedItem?: ConferenceGalleryItem;

  constructor(private route: ActivatedRoute, private router: Router, public langService: LanguageService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.selectedItem = this.galleryItems.find((item) => item.id === id);
  }

  goBack(): void {
    this.router.navigate(['/conferences']);
  }
}
