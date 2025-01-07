import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Authentication endpoints

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      responseType: 'json',
    });
  }
  saveUserInfo(token: string, username: string): void {
    localStorage.setItem('authToken', token); // Save token
    localStorage.setItem('username', username); // Save username
  }

getUsername(): string | null {
  return localStorage.getItem('username'); // Retrieve username
}

  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      responseType: 'json',
    });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token); // Save the token
  }

  getToken(): string | null {
    return localStorage.getItem('authToken'); // Retrieve the token
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  

  getMeetings(): Observable<any> {
    return this.http.get('http://localhost:8080/api/meetings', {
      headers: this.getAuthHeaders(),
    });
  }
  
  createMeeting(meeting: any): Observable<any> {
    const headers = this.getAuthHeaders(); // Get authorization headers
    return this.http.post('http://localhost:8080/api/meetings', meeting, { headers });
  }
  
  
  updateMeeting(meeting: any): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/meetings/${meeting.id}`,
      meeting,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }
  
  deleteMeeting(meetingId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/meetings/${meetingId}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
