import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode} from 'jwt-decode'; // Import jwtDecode properly

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Authentication endpoints

  constructor(private http: HttpClient) {}

  // Login request
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      responseType: 'json',
    });
  }

  // Save token and decode username
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    console.log('[DEBUG] Token saved to localStorage:', token); // Add this log
    try {
      const decoded: any = jwtDecode(token);
      localStorage.setItem('username', decoded.sub);
      console.log('[DEBUG] Decoded token payload:', decoded); // Add this log
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  

  // Save token and username
  saveUserInfo(token: string, username: string): void {
    localStorage.setItem('authToken', token); // Save token
    localStorage.setItem('username', username); // Save username
  }

  // Get the current username
  getUsername(): string | null {
    return localStorage.getItem('username'); // Retrieve username
  }

  // Register a new user
  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      responseType: 'json',
    });
  }

  // Get the token from localStorage
  getToken(): string | null {
    const token = localStorage.getItem('authToken');
    console.log('[DEBUG] Retrieved Token:', token);
    return token;
  }

  // Generate authorization headers
  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    if (!token) {
      console.error('No token found. Redirecting to login.');
      return new HttpHeaders(); // No token, return empty headers
    }
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Fetch meetings from the backend
  getMeetings(): Observable<any> {
    return this.http.get('http://localhost:8080/api/meetings', {
      headers: this.getAuthHeaders(),
    });
  }

  // Create a new meeting
  createMeeting(meeting: any): Observable<any> {
    return this.http.post('http://localhost:8080/api/meetings', meeting, {
      headers: this.getAuthHeaders(),
    });
  }

  // Update an existing meeting
  updateMeeting(meeting: any): Observable<any> {
    return this.http.put(
      `http://localhost:8080/api/meetings/${meeting.id}`,
      meeting,
      {
        headers: this.getAuthHeaders(),
      }
    );
  }

  // Delete a meeting
  deleteMeeting(meetingId: number): Observable<any> {
    return this.http.delete(`http://localhost:8080/api/meetings/${meetingId}`, {
      headers: this.getAuthHeaders(),
    });
  }
  
}
