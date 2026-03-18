import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- Import RouterModule
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-volunteer-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // <-- Add RouterModule here
  ],
  templateUrl: './volunteer-layout.html',
  styleUrls: ['./volunteer-layout.css']
})
export class VolunteerLayoutComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Logs the user out by clearing the token from storage
   * and navigates them back to the main landing page.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}