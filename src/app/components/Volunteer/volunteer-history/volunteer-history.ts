import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from '../../../services/case.service';

@Component({
  selector: 'app-volunteer-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './volunteer-history.html', // Corrected this in the next step
  styleUrls: ['./volunteer-history.css']
})
// FIX: Make sure the 'export' keyword is here
export class VolunteerHistoryComponent implements OnInit {
  history: any[] = [];

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.caseService.getVolunteerCases().subscribe(myCases => {
      this.history = myCases.filter(c => c.status === 'Resolved' || c.status === 'Closed');
    });
  }
}