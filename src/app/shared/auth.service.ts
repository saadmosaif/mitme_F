import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth'; // Base URL for authentication endpoints

  constructor(private http: HttpClient) {}

  /**
   * Login with username and password.
   * @param credentials Object containing `username` and `password`.
   * @returns Observable with the backend response.
   */
  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials, {
      responseType: 'json',
    });
  }

  /**
   * Register a new user.
   * @param user Object containing user details.
   * @returns Observable with the backend response.
   */
  register(user: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      responseType: 'json',
    });
  }
}
