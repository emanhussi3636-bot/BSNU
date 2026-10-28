import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CoursesDetailsComponent } from './courses-details/courses-details.component';
import { ContactComponent } from './contact/contact.component';
import { StaffComponent } from './staff/staff.component';
import { VicePresidentComponent } from './vice-president/vice-president.component'
import { TutionfeesComponent } from './tutionfees/tutionfees.component';
import { ApplicationrulesComponent } from './applicationrules/applicationrules.component';
import { UniversityNewsComponent } from './university-news/university-news.component';
import { UniversitySectorsComponent } from './university-sectors/university-sectors.component';
import { UnderconstructionComponent } from './underconstruction/underconstruction.component';
import { CalenderComponent } from './calender/calender.component';
import { ConferencesComponent } from './conferences/conferences.component';
import { GalleryConferencesComponent } from './gallery-conferences/gallery-conferences.component';
import { AllNewsComponent } from './all-news/all-news.component';
import { NewsDetailsComponent } from './newsdetails/newsdetails.component';
import { AllEventsComponent } from './all-events/all-events.component';
import { EventdetailsComponent } from './eventdetails/eventdetails.component';
export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'Program/:id',
        component: CoursesDetailsComponent
    },
    {
        path: 'clinical-program',
        component: UnderconstructionComponent
    },

    {
        path: 'contact',
        component: ContactComponent
    },

    {
        path: 'staff/dean/:id',
        component: StaffComponent
    },
    {
        path: 'staff/:id',
        component: StaffComponent
    },
    {
        path: 'vice_president/:id',
        component: VicePresidentComponent
    },
    {
        path: 'Applicationrules',
        component: ApplicationrulesComponent
    },
    {
        path: 'Tutionfees',
        component: TutionfeesComponent
    },
    {
        path: 'UniversitySectors',
        component: UniversitySectorsComponent        
    },
    {
        path: 'Calender',
        component: CalenderComponent        
    },
    {
        path: 'Underconstruction',
        component: UnderconstructionComponent        
    },
    {
        path: 'conferences',
        component: ConferencesComponent
    },
    {
        path: 'gallery-conferences/:id',
        component: GalleryConferencesComponent
    },
    {
        path: 'all-news',
        component: AllNewsComponent
    },
    {
        path: 'news/:id',
        component: NewsDetailsComponent
    },
    {
        path: 'all-events',
        component: AllEventsComponent
    },
    {
        path: 'eventdetails/:eventId/:programId',
        component: EventdetailsComponent
    },

];
