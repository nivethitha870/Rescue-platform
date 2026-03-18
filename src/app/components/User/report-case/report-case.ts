import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CaseService } from '../../../services/case.service';
import { ImageUploaderComponent } from '../../shared/image-uploader/image-uploader'; 
import { MapSelectorComponent } from '../../shared/map-selector/map-selector';

@Component({
  selector: 'app-report-case',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MapSelectorComponent,
    ImageUploaderComponent
  ],
  templateUrl: './report-case.html',
  styleUrls: ['./report-case.css']
})
export class ReportCaseComponent {
  reportForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // THE FIX: Add the isSubmitting property here.
  isSubmitting = false;

  constructor(private fb: FormBuilder, private caseService: CaseService, private router: Router) {
    this.reportForm = this.fb.group({
      caseType: ['', Validators.required],
      animal: ['', Validators.required],
      // 3. Update the form model for the new data
      imageBase64: ['', Validators.required],
      location: this.fb.group({
        coordinates: [null, Validators.required]
      }),
      address: [''] // Optional address field
    });
  }

  // 4. Create handlers to update the form when the child components emit data
  onImageUploaded(base64: string): void {
    this.reportForm.patchValue({ imageBase64: base64 });
  }

  onLocationSelected({ lat, lng }: { lat: number, lng: number }): void {
    this.reportForm.patchValue({ location: { coordinates: [lng, lat] } });
    // In a real app, you would use a geocoding service here to get the address string from lat/lng
    this.reportForm.patchValue({ address: `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}` });
  }

  onSubmit(): void {
    if (this.reportForm.invalid || this.isSubmitting) {
      this.reportForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.caseService.reportCase(this.reportForm.value).subscribe({
      next: () => {
        this.successMessage = 'Case reported successfully! Redirecting...';
        this.reportForm.reset(); 
        this.isSubmitting = false;
        setTimeout(() => {
          this.successMessage = null;
          this.router.navigate(['/user/dashboard']);
        }, 2000);
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to report case.';
        this.isSubmitting = false;
      }
    });
  }
}