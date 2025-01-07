import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {
  private apiUrl = 'http://localhost:8080/api/meetings';

  constructor(private http: HttpClient) {}

  getMeetings(): Observable<any> {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // Add Bearer token
    return this.http.get('http://localhost:8080/api/meetings', { headers }); // Include headers in request
  }
  
  
  
}
