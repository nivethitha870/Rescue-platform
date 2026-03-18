import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('x-auth-token', token || '');
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`, { headers: this.createAuthHeaders() });
  }

  updateProfile(userData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, userData, { headers: this.createAuthHeaders() });
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete`, { headers: this.createAuthHeaders() });
  }
}