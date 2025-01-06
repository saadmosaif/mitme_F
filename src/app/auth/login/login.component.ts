import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  credentials = { username: '', password: '' };

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (!this.credentials.username || !this.credentials.password) {
      alert('Please enter both username and password.');
      return;
    }

    this.authService.login(this.credentials).subscribe(
      (response) => {
        console.log('Login successful:', response);

        // Save token in localStorage or sessionStorage
        localStorage.setItem('authToken', response.token); // Replace with sessionStorage if needed

        alert('Login successful!');
        this.router.navigate(['/meeting']); // Redirect to dashboard
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Invalid username or password.');
      }
    );
  }
}
