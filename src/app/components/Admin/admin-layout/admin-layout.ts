import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // 1. Import RouterModule
import { AuthService } from '../../../services/auth.service'; // Adjust path if necessary

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule // 2. Add RouterModule to the component's imports
  ],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayout {

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  // 3. Add the logout() method that the HTML template is calling
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}