import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CaseService {
  private apiUrl = 'http://localhost:5000/api/cases';

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Helper to create authorization headers
  private createAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('x-auth-token', token || '');
  }

  reportCase(caseData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/report`, caseData, { headers: this.createAuthHeaders() });
  }

  getMyCases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/my-cases`, { headers: this.createAuthHeaders() });
  }


  // --- Volunteer Methods ---
  getAvailableCases(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/available`, { headers: this.createAuthHeaders() });
  }

  getVolunteerCases(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/my-assigned`, { headers: this.createAuthHeaders() });
  }

  acceptCase(caseId: string): Observable<any> {
      return this.http.patch(`${this.apiUrl}/${caseId}/accept`, {}, { headers: this.createAuthHeaders() });
  }

  resolveCase(caseId: string, proofUrl: string): Observable<any> {
      const body = { resolutionProofUrl: proofUrl };
      return this.http.patch(`${this.apiUrl}/${caseId}/resolve`, body, { headers: this.createAuthHeaders() });
  }



  // --- Admin Methods ---
  getAllCases(): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.createAuthHeaders() });
  }

  getAnalytics(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/analytics`, { headers: this.createAuthHeaders() });
  }
}