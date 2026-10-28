export interface NewsStory {
  id: string;
  category: 'CAMPUS' | 'CULTURE' | 'SPORTS';
  image: string;
  titleKey: string;
  descriptionKey: string;
  detailKey: string;
}

export const NEWS_STORIES: NewsStory[] = [
  {
    id: 'employment-fair-projects',
    category: 'CAMPUS',
    image: 'assets/news/ملتقي1.jpg',
    titleKey: 'allNews.ITEM1.TITLE',
    descriptionKey: 'allNews.ITEM1.DESCRIPTION',
    detailKey: 'allNews.ITEM1.DETAIL'
  },
  {
    id: 'employment-fair',
    category: 'CAMPUS',
    image: 'assets/news/ملتقي3.jpg',
    titleKey: 'allNews.ITEM2.TITLE',
    descriptionKey: 'allNews.ITEM2.DESCRIPTION',
    detailKey: 'allNews.ITEM2.DETAIL'
  },
  {
    id: 'grand-egyptian-museum',
    category: 'CAMPUS',
    image: 'assets/news/news-img02.jpeg',
    titleKey: 'allNews.ITEM3.TITLE',
    descriptionKey: 'allNews.ITEM3.DESCRIPTION',
    detailKey: 'allNews.ITEM3.DETAIL'
  },
  {
    id: 'creative-day',
    category: 'CULTURE',
    image: 'assets/news/news-img03.jpeg',
    titleKey: 'allNews.ITEM4.TITLE',
    descriptionKey: 'allNews.ITEM4.DESCRIPTION',
    detailKey: 'allNews.ITEM4.DETAIL'
  },
  {
    id: 'basketball-championship',
    category: 'SPORTS',
    image: 'assets/news/news-img01.jpeg',
    titleKey: 'allNews.ITEM5.TITLE',
    descriptionKey: 'allNews.ITEM5.DESCRIPTION',
    detailKey: 'allNews.ITEM5.DETAIL'
  }
];