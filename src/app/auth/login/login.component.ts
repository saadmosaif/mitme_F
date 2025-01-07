import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // For ngModel
import { Router } from '@angular/router'; // Import Router
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule], // Add FormsModule for ngModel
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' }; // Holds user input

  constructor(private authService: AuthService, private router: Router) {} // Inject AuthService and Router

  /**
   * Handles the login logic when the user submits their credentials.
   */
  login() {
    this.authService.login(this.credentials).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

        // Ensure the response contains a token
        if (response && response.token) {
          // Save the token in localStorage
          localStorage.setItem('authToken', response.token);

          // Navigate to the meeting page
          this.router.navigate(['/meeting']);
        } else {
          console.error('No token found in the response');
          alert('Unexpected error: No token received.');
        }
      },
      (error) => {
        console.error('Login failed:', error);

        // Display error messages based on HTTP status codes
        if (error.status === 403) {
          alert('Invalid credentials. Please check your username and password.');
        } else if (error.status === 500) {
          alert('Server error. Please try again later.');
        } else {
          alert('An unexpected error occurred. Please try again.');
        }
      }
    );
  }
}
