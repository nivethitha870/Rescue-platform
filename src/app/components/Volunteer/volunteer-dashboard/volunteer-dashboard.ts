import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { CaseService } from '../../../services/case.service';
import { SocketService } from '../../../services/socket';
import { CaseMapComponent } from '../../shared/case-map/case-map';
import { ImageUploaderComponent } from '../../shared/image-uploader/image-uploader';
import { SingleCaseMapComponent } from '../../shared/single-case-map/single-case-map';


@Component({
  selector: 'app-volunteer-dashboard',
  standalone: true,
  imports: [CommonModule, CaseMapComponent, ImageUploaderComponent, SingleCaseMapComponent],
  templateUrl: './volunteer-dashboard.html',
  styleUrls: ['./volunteer-dashboard.css']
})
export class VolunteerDashboardComponent implements OnInit, OnDestroy {
  resolvedCasesCount = 0;
  activeCases: any[] = [];
  availableCases: any[] = [];
  allMapCases: any[] = [];
  expandedCaseId: string | null = null;

  // State for modals
  isNewCaseModalVisible = false;
  newCaseToShow: any = null;
  isResolveModalVisible = false;
  caseToResolve: any = null;
  resolutionProofBase64: string | null = null;
  isSubmittingResolution = false;

  // THE FIX: New properties to manage the image viewer modal
  isImageViewerVisible = false;
  imageToShow: string | null = null;
  imageCaseDetails: string | null = null;

  // General state
  errorMessage: string | null = null;
  private subscriptions = new Subscription();

  constructor(
    private caseService: CaseService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.listenForUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadData(): void {
    this.caseService.getVolunteerCases().subscribe(myCases => {
      this.activeCases = myCases.filter(c => c.status === 'In Progress');
      this.resolvedCasesCount = myCases.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
      this.updateMapCases();
    });
    this.caseService.getAvailableCases().subscribe(available => {
        this.availableCases = available;
        this.updateMapCases();
    });
  }

  listenForUpdates(): void {
    // ... (This function remains exactly the same)
    const newCaseSub = this.socketService.listen<any>('newCaseAvailable').subscribe((newCase: any) => {
        this.availableCases.unshift(newCase);
        this.updateMapCases();
        if (!this.isNewCaseModalVisible && !this.isResolveModalVisible) {
          this.newCaseToShow = newCase;
          this.isNewCaseModalVisible = true;
        }
      });
  
      const caseUpdateSub = this.socketService.listen<any>('caseUpdated').subscribe(() => {
        this.loadData();
      });
  
      this.subscriptions.add(newCaseSub);
      this.subscriptions.add(caseUpdateSub);
  }

  updateMapCases(): void {
    this.allMapCases = [...this.activeCases, ...this.availableCases];
  }
  
  // THE FIX: New method to toggle the visibility of a case's map
  toggleCaseMap(caseId: string): void {
    // If the clicked case map is already open, close it. Otherwise, open it.
    if (this.expandedCaseId === caseId) {
      this.expandedCaseId = null;
    } else {
      this.expandedCaseId = caseId;
    }
  }
  
  onAcceptCase(caseId: string): void {
    this.caseService.acceptCase(caseId).subscribe({
      next: () => {
        // If the modal was open for this case, close it
        if (this.isNewCaseModalVisible && this.newCaseToShow?._id === caseId) {
          this.isNewCaseModalVisible = false;
          this.newCaseToShow = null;
        }
        // The 'caseUpdated' socket event will trigger a full data reload
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Could not accept case. It may have been taken.';
        // Also close the modal on error and reload data
        this.isNewCaseModalVisible = false;
        this.newCaseToShow = null;
        this.loadData();
      }
    });
  }

  onDeclineFromModal(): void {
    // Hide the modal, but leave the case in the "Available Cases" list
    this.isNewCaseModalVisible = false;
    this.newCaseToShow = null;
  }

  // --- Actions for the Resolve Case Modal ---
  openResolveModal(caseItem: any): void {
    this.caseToResolve = caseItem;
    this.resolutionProofBase64 = null;
    this.isResolveModalVisible = true;
  }

  onProofImageSelected(base64: string): void {
    this.resolutionProofBase64 = base64;
  }

  onResolveSubmit(): void {
    if (!this.caseToResolve || !this.resolutionProofBase64) return;
    
    this.isSubmittingResolution = true;
    this.errorMessage = null;

    this.caseService.resolveCase(this.caseToResolve._id, this.resolutionProofBase64).subscribe({
      next: () => {
        this.isSubmittingResolution = false;
        this.isResolveModalVisible = false;
        // The 'caseUpdated' socket event will handle the data refresh
      },
      error: (err) => {
        this.isSubmittingResolution = false;
        this.errorMessage = err.error.message || 'Failed to resolve case.';
      }
    });
  }

  // THE FIX: New method to open the image viewer modal
  openImageViewer(caseItem: any): void {
    if (caseItem && caseItem.imageBase64) {
      this.imageToShow = caseItem.imageBase64;
      this.imageCaseDetails = `${caseItem.animal} - ${caseItem.caseType}`;
      this.isImageViewerVisible = true;
    }
  }

  // THE FIX: Method to close the image viewer
  closeImageViewer(): void {
    this.isImageViewerVisible = false;
    this.imageToShow = null;
    this.imageCaseDetails = null;
  }
}