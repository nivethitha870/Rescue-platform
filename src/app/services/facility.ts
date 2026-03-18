import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  private apiUrl = 'http://localhost:5000/api/facilities';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('x-auth-token', token || '');
  }

  getFacilities(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.createAuthHeaders() });
  }

  // ... (inside FacilityService class)
addFacility(facilityData: any): Observable<any> {
    return this.http.post(this.apiUrl, facilityData, { headers: this.createAuthHeaders() });
}
}