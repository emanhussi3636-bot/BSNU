export interface UniversityEvent {
  id: number;
  programId: string;
  titleKey: string;
  images: string[];
  coverImage?: string;
  date?: string;
  subtitleKey?: string;
  snippetKey?: string;
  detailKey?: string;
  locationKey?: string;
  typeKey?: string;
}

export interface EventGroup {
  id: string;
  nameKey: string;
  events: UniversityEvent[];
}

export const EVENT_GROUPS: EventGroup[] = [
  {
    id: 'public',
    nameKey: 'ALL_EVENTS.PUBLIC',
    events: [
      {
        id: 1,
        programId: 'public',
        titleKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.TITLE',
        subtitleKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.SUBTITLE',
        snippetKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.SNIPPET',
        detailKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.DETAIL',
        locationKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.LOCATION',
        typeKey: 'CONFERENCES.CARDS.GLOBAL_EDUCATION_FORUM.TYPE',
        coverImage: '/assets/event/مناخ1.jpg',
        images: [
          '/assets/event/مناخ2.jpg',
          '/assets/event/مناخ1.jpg',
          '/assets/event/مناخ3.jpg',
          '/assets/event/مناخ4.jpg'
        ],
        date: 'June 5, 2026'
      },
      {
        id: 2,
        programId: 'public',
        titleKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.TITLE',
        subtitleKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.SUBTITLE',
        snippetKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.SNIPPET',
        detailKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.DETAIL',
        locationKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.LOCATION',
        typeKey: 'CONFERENCES.CARDS.INNOVATION_IN_STEM_EXPO.TYPE',
        images: [
          '/assets/news/ملتقي1.jpg',
          '/assets/news/ملتقي2.jpg',
          '/assets/news/ملتقي3.jpg',
          '/assets/news/ملتقي توظيفي.jpg'
        ],
        date: 'July 14, 2026'
      },
      {
        id: 3,
        programId: 'public',
        titleKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.TITLE',
        subtitleKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.SUBTITLE',
        snippetKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.SNIPPET',
        detailKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.DETAIL',
        locationKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.LOCATION',
        typeKey: 'CONFERENCES.CARDS.CULTURAL_EXCHANGE_SYMPOSIUM.TYPE',
        images: ['/assets/news/وفد_معهد_الاورام.jpg'],
        date: 'August 22, 2026'
      },
      {
        id: 4,
        programId: 'public',
        titleKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.TITLE',
        subtitleKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.SUBTITLE',
        snippetKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.SNIPPET',
        detailKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.DETAIL',
        locationKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.LOCATION',
        typeKey: 'CONFERENCES.CARDS.HEALTH_WELLNESS_CONFERENCE.TYPE',
        images: [
          '/assets/event/توقيع1.jpg',
          '/assets/event/توقيع3.jpg',
          '/assets/event/توقبع2.jpg'
        ],
        date: 'September 10, 2026'
      }
    ]
  },
  {
    id: 'medicine',
    nameKey: 'MEDICAL.TITLE',
    events: [
      { id: 1, programId: 'medicine', titleKey: 'MEDICAL.EVENT1', images: ['/assets/course/medicine/impact3.jpg'], date: '29/09/2025' },
      { id: 2, programId: 'medicine', titleKey: 'MEDICAL.EVENT2', images: ['/assets/program/pro-img03.jpg'], date: '18/05/2025' },
      { id: 3, programId: 'medicine', titleKey: 'MEDICAL.EVENT3', images: ['/assets/program/pro-img04.jpg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'ai',
    nameKey: 'AI.TITLE',
    events: [
      { id: 1, programId: 'ai', titleKey: 'AI.EVENT1', images: ['/assets/feature/Ai/4.jpeg'], date: '29/09/2025' },
      { id: 2, programId: 'ai', titleKey: 'AI.EVENT2', images: ['/assets/feature/Ai/5.jpeg'], date: '18/05/2025' },
      { id: 3, programId: 'ai', titleKey: 'AI.EVENT3', images: ['/assets/course/6.jpeg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'cybersecurity',
    nameKey: 'CYBERSECURITY.TITLE',
    events: [
      { id: 1, programId: 'cybersecurity', titleKey: 'CYBERSECURITY.EVENT1', images: ['/assets/course/cybersecurity/4.jpeg'], date: '29/09/2025' },
      { id: 2, programId: 'cybersecurity', titleKey: 'CYBERSECURITY.EVENT2', images: ['/assets/course/cybersecurity/1.jpg'], date: '18/05/2025' },
      { id: 3, programId: 'cybersecurity', titleKey: 'CYBERSECURITY.EVENT3', images: ['/assets/course/cybersecurity/6.jpg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'dentistry',
    nameKey: 'DENTAL.TITLE',
    events: [
      { id: 1, programId: 'dentistry', titleKey: 'DENTAL.EVENT1', images: ['/assets/course/dentalprogram/9.jpg'] },
      { id: 2, programId: 'dentistry', titleKey: 'DENTAL.EVENT2', images: ['/assets/course/dentalprogram/10.jpg'] },
      { id: 3, programId: 'dentistry', titleKey: 'DENTAL.EVENT3', images: ['/assets/course/dentalprogram/8.jpg'] }
    ]
  },
  {
    id: 'engineering',
    nameKey: 'ENGINEERING.TITLE',
    events: [
      { id: 1, programId: 'engineering', titleKey: 'ENGINEERING.EVENT1', images: ['/assets/course/Engineering/1.jpg'], date: '29/09/2025' },
      { id: 2, programId: 'engineering', titleKey: 'ENGINEERING.EVENT2', images: ['/assets/course/Engineering/2.jpg'], date: '18/05/2025' },
      { id: 3, programId: 'engineering', titleKey: 'ENGINEERING.EVENT3', images: ['/assets/course/Engineering/3.jpg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'biochemistry',
    nameKey: 'BIOCHEMISTRY.TITLE',
    events: [
      { id: 1, programId: 'biochemistry', titleKey: 'BIOCHEMISTRY.EVENT1', images: ['/assets/course/bio/10.jpeg'], date: '29/09/2025' },
      { id: 2, programId: 'biochemistry', titleKey: 'BIOCHEMISTRY.EVENT2', images: ['/assets/course/bio/2.jpeg'], date: '18/05/2025' },
      { id: 3, programId: 'biochemistry', titleKey: 'BIOCHEMISTRY.EVENT3', images: ['/assets/course/bio/3.jpeg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'industrial-chemistry',
    nameKey: 'INDUSTRIAL_CHEMISTRY.TITLE',
    events: [
      { id: 1, programId: 'industrial-chemistry', titleKey: 'INDUSTRIAL_CHEMISTRY.EVENT1', images: ['/assets/course/industrial/1.jpg'], date: '29/09/2025' },
      { id: 2, programId: 'industrial-chemistry', titleKey: 'INDUSTRIAL_CHEMISTRY.EVENT2', images: ['/assets/course/industrial/6.jpg'], date: '18/05/2025' },
      { id: 3, programId: 'industrial-chemistry', titleKey: 'INDUSTRIAL_CHEMISTRY.EVENT3', images: ['/assets/course/industrial/3.jpg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'navigation-sciences',
    nameKey: 'NAVIGATION_SCIENCES.TITLE',
    events: [
      { id: 1, programId: 'navigation-sciences', titleKey: 'NAVIGATION_SCIENCES.EVENT1', images: ['/assets/course/NavigationSciences/31.jpg'] },
      { id: 2, programId: 'navigation-sciences', titleKey: 'NAVIGATION_SCIENCES.EVENT2', images: ['/assets/course/NavigationSciences/32.jpg'] },
      { id: 3, programId: 'navigation-sciences', titleKey: 'NAVIGATION_SCIENCES.EVENT3', images: ['/assets/course/NavigationSciences/33.jpg'] }
    ]
  },
  {
    id: 'nursing',
    nameKey: 'NURSING.TITLE',
    events: [
      { id: 1, programId: 'nursing', titleKey: 'NURSING.EVENT1', images: ['/assets/course/4.jpeg'], date: '29/09/2025' },
      { id: 2, programId: 'nursing', titleKey: 'NURSING.EVENT2', images: ['/assets/course/5.jpeg'], date: '18/05/2025' },
      { id: 3, programId: 'nursing', titleKey: 'NURSING.EVENT3', images: ['/assets/course/6.jpeg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'petroleum-mining',
    nameKey: 'PETROLEUM_MINING.TITLE',
    events: [
      { id: 1, programId: 'petroleum-mining', titleKey: 'PETROLEUM_MINING.EVENT1', images: ['/assets/course/mininggeology/12.jpg'] },
      { id: 2, programId: 'petroleum-mining', titleKey: 'PETROLEUM_MINING.EVENT2', images: ['/assets/course/mininggeology/11.jpg'] },
      { id: 3, programId: 'petroleum-mining', titleKey: 'PETROLEUM_MINING.EVENT3', images: ['/assets/course/mininggeology/9.jpg'] }
    ]
  },
  {
    id: 'pharmacy',
    nameKey: 'PHARMACY.TITLE',
    events: [
      { id: 1, programId: 'pharmacy', titleKey: 'PHARMACY.EVENT1', images: ['/assets/course/pharmaprogram/13.jpg'] },
      { id: 2, programId: 'pharmacy', titleKey: 'PHARMACY.EVENT2', images: ['/assets/course/pharmaprogram/3.png'] },
      { id: 3, programId: 'pharmacy', titleKey: 'PHARMACY.EVENT3', images: ['/assets/course/pharmaprogram/8.jpg'] }
    ]
  },
  {
    id: 'physical-therapy',
    nameKey: 'PHYSICAL_THERAPY.TITLE',
    events: [
      { id: 1, programId: 'physical-therapy', titleKey: 'PHYSICAL_THERAPY.EVENT1', images: ['/assets/course/physicaltherapy/1.jpg'], date: '29/09/2025' },
      { id: 2, programId: 'physical-therapy', titleKey: 'PHYSICAL_THERAPY.EVENT2', images: ['/assets/course/physicaltherapy/2.png'], date: '18/05/2025' },
      { id: 3, programId: 'physical-therapy', titleKey: 'PHYSICAL_THERAPY.EVENT3', images: ['/assets/course/physicaltherapy/3.jpg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'television-film-production',
    nameKey: 'Program_TVFilm.breadcrumb_title',
    events: [
      { id: 1, programId: 'television-film-production', titleKey: 'Program_TVFilm.EVENT1', images: ['/assets/course/4.jpeg'], date: '29/09/2025' },
      { id: 2, programId: 'television-film-production', titleKey: 'Program_TVFilm.EVENT2', images: ['/assets/course/5.jpeg'], date: '18/05/2025' },
      { id: 3, programId: 'television-film-production', titleKey: 'Program_TVFilm.EVENT3', images: ['/assets/course/6.jpeg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'digital-journalism',
    nameKey: 'Program_DigitalJournalism.breadcrumb_title',
    events: [
      { id: 1, programId: 'digital-journalism', titleKey: 'Program_DigitalJournalism.EVENT1', images: ['/assets/course/dj/13.jpg'], date: '29/09/2025' },
      { id: 2, programId: 'digital-journalism', titleKey: 'Program_DigitalJournalism.EVENT2', images: ['/assets/course/dj/14.jpg'], date: '18/05/2025' },
      { id: 3, programId: 'digital-journalism', titleKey: 'Program_DigitalJournalism.EVENT3', images: ['/assets/course/dj/15.jpg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'commerce',
    nameKey: 'Program_Commerce.breadcrumb_title',
    events: [
      { id: 1, programId: 'commerce', titleKey: 'Program_Commerce.EVENT1', images: ['/assets/course/commerce/1.jpg'], date: '29/09/2025' },
      { id: 2, programId: 'commerce', titleKey: 'Program_Commerce.EVENT2', images: ['/assets/course/commerce/2.jpg'], date: '18/05/2025' },
      { id: 3, programId: 'commerce', titleKey: 'Program_Commerce.EVENT3', images: ['/assets/course/commerce/3.jpg'], date: '08/12/2025' }
    ]
  },
  {
    id: 'clinical-psychology',
    nameKey: 'Program_ClinicalPsychology.breadcrumb_title',
    events: [
      { id: 1, programId: 'clinical-psychology', titleKey: 'Program_ClinicalPsychology.EVENT1', images: ['/assets/course/clinical/30.jpg'] },
      { id: 2, programId: 'clinical-psychology', titleKey: 'Program_ClinicalPsychology.EVENT2', images: ['/assets/course/clinical/26.jpg'] },
      { id: 3, programId: 'clinical-psychology', titleKey: 'Program_ClinicalPsychology.EVENT3', images: ['/assets/course/clinical/29.jpg'] }
    ]
  },
  {
    id: 'law',
    nameKey: 'Program_Law.breadcrumb_title',
    events: [
      { id: 1, programId: 'law', titleKey: 'Program_Law.EVENT1', images: ['/assets/course/law/1.jpg'], date: '29/09/2025' },
      { id: 2, programId: 'law', titleKey: 'Program_Law.EVENT2', images: ['/assets/course/law/2.jpg'], date: '18/05/2025' },
      { id: 3, programId: 'law', titleKey: 'Program_Law.EVENT3', images: ['/assets/course/law/3.jpg'], date: '08/12/2025' }
    ]
  }
];
