import { Routes } from '@angular/router';
import { Landing } from './landing/landing';
import { SigninComponent } from './auth/signin/signin';
import { RegisterComponent } from './auth/register/register';

import { AdminDashboardComponent } from './components/Admin/admin-dashboard/admin-dashboard';
import { VolunteerDashboardComponent } from './components/Volunteer/volunteer-dashboard/volunteer-dashboard';
import { UserDashboardComponent } from './components/User/user-dashboard/user-dashboard';
import { UserLayoutComponent } from './components/User/user-layout/user-layout';
import { HistoryComponent } from './components/User/history/history';
import { ReportCaseComponent } from './components/User/report-case/report-case';
import { AuthGuard } from './services/auth-guard';
import { VolunteerLayoutComponent } from './components/Volunteer/volunteer-layout/volunteer-layout';
import { VolunteerHistoryComponent } from './components/Volunteer/volunteer-history/volunteer-history';
import { AdminManagementComponent } from './components/Admin/admin-management/admin-management';
import { AdminLayout } from './components/Admin/admin-layout/admin-layout';

import { ProfileComponent } from './components/shared/profile/profile'; // <-- Import the new component


import { FacilityManagementComponent } from './components/Admin/facility-management/facility-management';

export const routes: Routes = [
    // Your existing routes
    { path: 'landing', component: Landing },
    { path: 'signin/:role', component: SigninComponent },
    { path: 'signin', component: SigninComponent },
    { path: 'register/:role', component: RegisterComponent },
    { path: 'register', component: RegisterComponent },

    {
        path: 'admin',
        component: AdminLayout,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: AdminDashboardComponent },
            { path: 'manage-cases', component: AdminManagementComponent },
            { path: 'manage-facilities', component: FacilityManagementComponent },
            { path: 'profile', component: ProfileComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'volunteer',
        component: VolunteerLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: VolunteerDashboardComponent },
            { path: 'history', component: VolunteerHistoryComponent },
            { path: 'profile', component: ProfileComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    {
        path: 'user', // Base path for all user-related pages
        component: UserLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'dashboard', component: UserDashboardComponent },
            { path: 'report-case', component: ReportCaseComponent },
            { path: 'history', component: HistoryComponent },
            { path: 'profile', component: ProfileComponent },
            // Redirect /user to /user/dashboard by default
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },

    // Your default redirect should be the last route
    { path: '', redirectTo: '/landing', pathMatch: 'full' },

    // It's also good practice to have a wildcard route to catch any typos or undefined URLs
    { path: '**', redirectTo: '/landing' }
];