import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // <-- IMPORT ROUTERMODULE
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterModule], // <-- ADD THIS
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.css']
})
export class UserLayoutComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/landing']);
  }
}