import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../services/language.service';

interface CalendarRow {
  labelKey: string;
  dateKey: string;
}

@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css']
})
export class CalenderComponent {
  rows: CalendarRow[] = [
    { labelKey: 'Calendar.ROWS.REGISTRATION', dateKey: 'Calendar.ROWS.REGISTRATION_DATE' },
    { labelKey: 'Calendar.ROWS.ADD_DROP', dateKey: 'Calendar.ROWS.ADD_DROP_DATE' },
    { labelKey: 'Calendar.ROWS.REGISTRATION_CLOSE', dateKey: 'Calendar.ROWS.REGISTRATION_CLOSE_DATE' },
    { labelKey: 'Calendar.ROWS.LECTURES', dateKey: 'Calendar.ROWS.LECTURES_DATE' },
    { labelKey: 'Calendar.ROWS.MID_TERM_GUIDELINE', dateKey: 'Calendar.ROWS.MID_TERM_GUIDELINE_DATE' },
    { labelKey: 'Calendar.ROWS.MID_TERM', dateKey: 'Calendar.ROWS.MID_TERM_DATE' },
    { labelKey: 'Calendar.ROWS.SECOND_CYCLE_GUIDELINE', dateKey: 'Calendar.ROWS.SECOND_CYCLE_GUIDELINE_DATE' },
    { labelKey: 'Calendar.ROWS.LABS_END', dateKey: 'Calendar.ROWS.LABS_END_DATE' },
    { labelKey: 'Calendar.ROWS.WITHDRAWAL_END', dateKey: 'Calendar.ROWS.WITHDRAWAL_END_DATE' },
    { labelKey: 'Calendar.ROWS.FINAL_EXAMS', dateKey: 'Calendar.ROWS.FINAL_EXAMS_DATE' }
  ];

  constructor(public langService: LanguageService) {}
}
