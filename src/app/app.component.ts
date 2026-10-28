import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HeroComponent } from './hero/hero.component';
import { ContactComponent } from "./contact/contact.component";
import { UniversityNewsComponent } from "./university-news/university-news.component";
import { ProgramComponent } from "./program/program.component";
import { EventsComponent } from "./events/events.component";
import { FAQComponent } from "./faq/faq.component";
import { FooterComponent } from "./footer/footer.component";
import { DepartmentsComponent } from "./departments/departments.component";
import { UniversitySliderComponent } from "./university-slider/university-slider.component";
import { CoursesDetailsComponent } from "./courses-details/courses-details.component";
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BSNU_WebSite';
}
