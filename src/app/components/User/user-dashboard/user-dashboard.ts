import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CaseService } from '../../../services/case.service';
import { SocketService } from '../../../services/socket';// Corrected path if needed

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.html',
  styleUrls: ['./user-dashboard.css']
})
export class UserDashboardComponent implements OnInit, OnDestroy {
  totalCasesReported = 0;
  
  // THE FIX: This is now an array to hold all ongoing cases.
  ongoingCases: any[] = []; 

  private caseUpdateSub: Subscription | undefined;

  constructor(
    private caseService: CaseService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();

    // Listen for real-time updates from the server
    this.caseUpdateSub = this.socketService.listen<any>('caseUpdated').subscribe((updatedCase: any) => {
      console.log('Case update received on user dashboard:', updatedCase);
      // When any case status changes, reload all dashboard data
      this.loadDashboardData();
    });
  }

  ngOnDestroy(): void {
    // Clean up the subscription to prevent memory leaks
    this.caseUpdateSub?.unsubscribe();
  }

  loadDashboardData(): void {
    this.caseService.getMyCases().subscribe(cases => {
      this.totalCasesReported = cases.length;
      
      // THE FIX: Filter for all ongoing cases and sort them by most recently reported.
      this.ongoingCases = cases
        .filter(c => c.status !== 'Resolved' && c.status !== 'Closed')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
  }
}