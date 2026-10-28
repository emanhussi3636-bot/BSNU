import { Component } from '@angular/core';
import { LanguageService } from '../services/language.service';
@Component({
  selector: 'app-program',
  imports: [],
  templateUrl: './program.component.html',
  styleUrl: './program.component.css'
})
export class ProgramComponent {
constructor(public langService: LanguageService) {}
}
