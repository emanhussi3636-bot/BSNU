import { Component } from '@angular/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
constructor(public langService: LanguageService) {}
}
  