import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaseService } from '../../../services/case.service';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-management.html',
  styleUrls: ['./admin-management.css']
})
export class AdminManagementComponent implements OnInit {
  allCases: any[] = [];
  
  // THE FIX: Properties to manage the details modal
  isDetailsModalVisible = false;
  selectedCase: any = null;
  
  constructor(private caseService: CaseService) {}

  ngOnInit(): void {
    this.caseService.getAllCases().subscribe(cases => {
      this.allCases = cases;
    });
  }

  // THE FIX: Method to open the modal with the selected case data
  openDetailsModal(caseItem: any): void {
    this.selectedCase = caseItem;
    this.isDetailsModalVisible = true;
  }

  // THE FIX: Method to close the modal
  closeDetailsModal(): void {
    this.isDetailsModalVisible = false;
    this.selectedCase = null;
  }
}