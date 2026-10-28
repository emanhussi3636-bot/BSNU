import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-underconstruction',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './underconstruction.component.html',
  styleUrls: ['./underconstruction.component.css']
})
export class UnderconstructionComponent {
  constructor(public langService: LanguageService) {}
}
