import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { AuthService } from '../../shared/auth.service'; // Import the AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule], // Add FormsModule and HttpClientModule
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private authService: AuthService) {}

  login() {
    console.log('Attempting to log in...');
    console.log('Provided credentials:', this.credentials);

    // Validate input fields
    if (!this.credentials.username || !this.credentials.password) {
      console.error('Validation failed: Username or password is missing.');
      alert('Please enter both username and password.');
      return;
    }

    // Call AuthService for real login
    this.authService.login(this.credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);
        alert('Login successful!');
        // Perform additional actions on success (e.g., navigate to another page)
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Invalid username or password.');
      }
    );
  }
}
