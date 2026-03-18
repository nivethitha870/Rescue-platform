import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

// Define a type for the decoded token payload
interface DecodedToken {
  user: {
    id: string;
    role: 'admin' | 'volunteer' | 'user';
  };
  iat: number;
  exp: number;
}

@Component({
  selector: 'app-signin',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signin.html',
  styleUrls: ['./signin.css'],
  standalone: true
})
export class SigninComponent implements OnInit {

  signinForm: FormGroup;
  selectedRole: 'volunteer' | 'admin' | 'user' = 'user';
  errorMessage: string | null = null;
  
  roleContent = {
    volunteer: {
      title: 'Welcome Back',
      subtitle: 'Sign in to continue helping stray animals',
      buttonText: 'Sign In as Volunteer',
      roleText: 'Volunteer'
    },
    admin: {
      title: 'Admin Portal',
      subtitle: 'Sign in to manage rescue operations',
      buttonText: 'Sign In as Admin',
      roleText: 'Admin'
    },
    user: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your StrayRescue account',
      buttonText: 'Sign In as User',
      roleText: 'User'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const roleFromUrl = params.get('role') as 'volunteer' | 'admin' | 'user';
      if (roleFromUrl && ['volunteer', 'admin', 'user'].includes(roleFromUrl)) {
        this.selectedRole = roleFromUrl;
      }
    });
  }

// ... inside the SigninComponent class ...

  onSubmit(): void {
      if (this.signinForm.invalid) {
        this.signinForm.markAllAsTouched();
        return;
      }

      // Combine form values AND the selected role
      const credentials = {
          ...this.signinForm.value,
          role: this.selectedRole 
      };

      // Send the combined object to the auth service
      this.authService.login(credentials).subscribe({
        next: (response) => {
          // ... (the rest of the success logic is the same)
          const token = this.authService.getToken();
          if (token) {
            const decodedToken: DecodedToken = jwtDecode(token);
            const userRole = decodedToken.user.role;
            this.router.navigate([`/${userRole}/dashboard`]);
          }
        },
        error: (err) => {
          // ... (error handling is the same)
          this.errorMessage = err.error.message || 'Login failed. Please check your credentials.';
        }
      });
  }
  
  // =================================================================
  // == THIS FUNCTION MUST EXIST AND HAVE A RETURN STATEMENT ==
  // =================================================================
  // This function returns the correct object from roleContent based on the selected role.
  getRoleContent() {
    return this.roleContent[this.selectedRole];
  }

  // This function allows the dropdown to change the selected role.
  changeRole(role: 'volunteer' | 'admin' | 'user'): void {
    this.selectedRole = role;
  }
}