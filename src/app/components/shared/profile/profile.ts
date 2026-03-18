import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  user: any = null;
  isEditing = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // THE FIX: New property to control the delete confirmation modal
  isDeleteModalVisible = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: ['', Validators.required],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.userService.getProfile().subscribe(data => {
      this.user = data;
      this.profileForm.patchValue(this.user);
    });
  }

  toggleEdit(cancel = false): void {
    this.isEditing = !this.isEditing;
    this.successMessage = null;
    this.errorMessage = null;
    if (cancel) {
      this.profileForm.patchValue(this.user);
    }
  }

  onUpdate(): void {
    if (this.profileForm.invalid) return;

    this.userService.updateProfile(this.profileForm.value).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.successMessage = "Profile updated successfully!";
        this.isEditing = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Failed to update profile.";
      }
    });
  }

  // THE FIX: This now just opens the modal instead of showing a confirm() dialog
  openDeleteModal(): void {
    this.errorMessage = null; // Clear any previous errors
    this.isDeleteModalVisible = true;
  }

  // THE FIX: A separate method to handle the final deletion after confirmation
  confirmDelete(): void {
    this.userService.deleteProfile().subscribe({
      next: () => {
        // We can close the modal, but the user will be redirected anyway
        this.isDeleteModalVisible = false;
        alert('Your account has been successfully deleted.');
        this.authService.logout();
        this.router.navigate(['/landing']);
      },
      error: (err) => {
        this.errorMessage = err.error.message || "Failed to delete account.";
        // Keep the modal open to show the error
      }
    });
  }
}