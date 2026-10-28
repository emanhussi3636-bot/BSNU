import { Component, HostListener  } from '@angular/core';
// import { RouterLink, RouterOutlet } from "../../../node_modules/@angular/router/router_module.d-Bx9ArA6K";
import { RouterLinkWithHref, RouterOutlet } from "@angular/router";
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLinkWithHref, RouterOutlet, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
scrolled = false;
@HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 50;
  }

  constructor(public langService: LanguageService) {}

  switchToArabic() {
    this.langService.setLanguage('ar');
    document.dir = 'rtl';
  }

  switchToEnglish() {
    this.langService.setLanguage('en');
    document.dir = 'ltr';
  }
    closeMobileNavbarOnLink(event: MouseEvent) {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest('a[routerLink]')) {
      return;
    }

    // this.activeStaffFacultyId = null;
    const navbar = document.getElementById('navbarNav');
    if (!navbar || window.innerWidth >= 992) {
      return;
    }

    navbar.classList.remove('show');
    navbar.querySelectorAll('.show').forEach((element) => element.classList.remove('show'));
    navbar.querySelectorAll('[aria-expanded="true"]').forEach((element) => {
      element.setAttribute('aria-expanded', 'false');
    });
    navbar.closest('.navbar')?.querySelector('.navbar-toggler')?.setAttribute('aria-expanded', 'false');
  }
}
