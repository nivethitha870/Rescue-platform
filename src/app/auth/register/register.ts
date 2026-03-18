import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// Import Reactive Forms modules
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';// Adjust path if necessary

// Custom Validator for matching passwords
export function passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
  const password = group.get('password');
  const confirmPassword = group.get('confirmPassword');
  return password && confirmPassword && password.value !== confirmPassword.value ? { 'passwordMismatch': true } : null;
}

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  standalone: true
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  selectedRole: 'volunteer' | 'admin' | 'user' = 'user';
  errorMessage: string | null = null;
  
  // Define the roleContent for each role type
  roleContent = {
    volunteer: {
      roleText: 'Volunteer',
      title: 'Volunteer Registration',
      subtitle: 'Sign up to help animals in need.',
      buttonText: 'Register as Volunteer'
    },
    admin: {
      roleText: 'Administrator',
      title: 'Admin Registration',
      subtitle: 'Create an admin account to manage the platform.',
      buttonText: 'Register as Admin'
    },
    user: {
      roleText: 'User',
      title: 'User Registration',
      subtitle: 'Sign up to adopt or foster pets.',
      buttonText: 'Register as User'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Initialize the form
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const roleFromUrl = params.get('role') as 'volunteer' | 'admin' | 'user';
      if (roleFromUrl && ['volunteer', 'admin', 'user'].includes(roleFromUrl)) {
        this.selectedRole = roleFromUrl;
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched(); // Mark fields to show errors
      return;
    }

    // Add the selected role to the form data
    const formData = { ...this.registerForm.value, role: this.selectedRole };
    delete formData.confirmPassword; // Don't send confirmPassword to backend

    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        // Optionally, log the user in automatically and navigate to a dashboard
        this.router.navigate(['/signin', this.selectedRole]);
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.errorMessage = err.error.message || 'An unknown error occurred.';
      }
    });
  }
  
  // Get the content based on the selected role
  getRoleContent() {
    return this.roleContent[this.selectedRole];
  }

  changeRole(role: 'volunteer' | 'admin' | 'user'): void {
    this.selectedRole = role;
  }
}
