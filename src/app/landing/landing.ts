import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports :[CommonModule, RouterModule],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class Landing {

  // Define the role types
  selectedRole: 'volunteer' | 'admin' | 'user' = 'user'; // Default to volunteer

  // Define the role content structure
  roleContent = {
    volunteer: {
      buttonText: 'Join as Volunteer',
      signInText: 'Sign In',
      roleText: 'Volunteer'
    },
    admin: {
      buttonText: 'Join as Admin',
      signInText: 'Sign In',
      roleText: 'Admin'
    },
    user: {
      buttonText: 'Join as User',
      signInText: 'Sign In',
      roleText: 'User'
    }
  };

  // Function to change the role
  changeRole(role: 'volunteer' | 'admin' | 'user'): void {
    this.selectedRole = role;
  }

  // Get content based on selected role
  getRoleContent() {
    return this.roleContent[this.selectedRole];
  }
}
