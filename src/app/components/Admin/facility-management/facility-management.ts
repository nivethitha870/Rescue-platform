import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FacilityService } from '../../../services/facility';
// Import the reusable map selector
import { MapSelectorComponent } from '../../shared/map-selector/map-selector';

@Component({
  selector: 'app-facility-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MapSelectorComponent // Import our map component
  ],
  templateUrl: './facility-management.html',
  styleUrls: ['./facility-management.css']
})
export class FacilityManagementComponent {
  facilityForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private facilityService: FacilityService
  ) {
    this.facilityForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      address: [''], // Optional
      location: this.fb.group({
        coordinates: [null, Validators.required] // Will be populated by the map
      })
    });
  }

  // This function is called when the map component emits a location
  onLocationSelected({ lat, lng }: { lat: number, lng: number }): void {
    this.facilityForm.patchValue({ location: { coordinates: [lng, lat] } });
    // In a real app, you would use a geocoding service to get the address from lat/lng
    this.facilityForm.patchValue({ address: `Coordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}` });
  }

  onSubmit(): void {
    if (this.facilityForm.invalid) {
      this.facilityForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.facilityService.addFacility(this.facilityForm.value).subscribe({
      next: (response) => {
        this.successMessage = `Facility "${response.name}" added successfully!`;
        this.facilityForm.reset();
        this.isSubmitting = false;
        // You might want to reload a list of facilities here if you were displaying one
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Failed to add facility.';
        this.isSubmitting = false;
      }
    });
  }
}