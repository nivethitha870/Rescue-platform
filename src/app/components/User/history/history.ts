import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from '../../../services/case.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.html',
  styleUrls: ['./history.css']
})
export class HistoryComponent implements OnInit {
  resolvedCases: any[] = [];

  // THE FIX: New properties to manage the proof viewer modal state
  isProofModalVisible = false;
  proofImageToShow: string | null = null;
  proofCaseDetails: string | null = null;

  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.caseService.getMyCases().subscribe(cases => {
      // Filter for resolved cases and sort by most recently resolved
      this.resolvedCases = cases
        .filter(c => c.status === 'Resolved' || c.status === 'Closed')
        .sort((a, b) => new Date(b.resolvedAt || b.updatedAt).getTime() - new Date(a.resolvedAt || a.updatedAt).getTime());
    });
  }

  // THE FIX: Method to open the modal with the selected case's proof image
  openProofModal(caseItem: any): void {
    if (caseItem && caseItem.resolutionProofUrl) {
      this.proofImageToShow = caseItem.resolutionProofUrl;
      this.proofCaseDetails = `${caseItem.animal} - ${caseItem.caseType}`;
      this.isProofModalVisible = true;
    }
  }

  // THE FIX: Method to close the modal
  closeProofModal(): void {
    this.isProofModalVisible = false;
    // Delay clearing the image to prevent a jarring visual flash
    setTimeout(() => {
        this.proofImageToShow = null;
        this.proofCaseDetails = null;
    }, 300); // 300ms matches the animation duration
  }
}