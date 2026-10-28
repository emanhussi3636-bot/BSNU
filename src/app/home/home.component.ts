import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { HeroComponent } from "../hero/hero.component";
import { DepartmentsComponent } from "../departments/departments.component";
import { UniversitySliderComponent } from "../university-slider/university-slider.component";
import { ProgramComponent } from "../program/program.component";
import { UniversityNewsComponent } from "../university-news/university-news.component";
import { EventsComponent } from "../events/events.component";
import { FAQComponent } from "../faq/faq.component";
import { FooterComponent } from "../footer/footer.component";

import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, DepartmentsComponent, UniversitySliderComponent, ProgramComponent, UniversityNewsComponent, EventsComponent, FAQComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
constructor(public langService: LanguageService) {}
}
