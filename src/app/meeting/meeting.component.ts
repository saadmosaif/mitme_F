import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  meetings: any[] = [];
  newMeeting = { title: '', description: '', createdAt: null as Date | null, host: '' };
  currentUser: string = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('No token found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.getCurrentUser();
    this.fetchMeetings();
  }

  getCurrentUser(): string {
    const token = this.authService.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub;
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return '';
  }

  fetchMeetings(): void {
    this.isLoading = true;
    this.authService.getMeetings().subscribe(
      (response) => {
        this.meetings = response;
        console.log('Fetched meetings:', this.meetings);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching meetings:', error);
        alert('Failed to load meetings. Please check your authorization.');
        this.isLoading = false;
      }
    );
  }

  createMeeting(): void {
    if (!this.newMeeting.title || !this.newMeeting.description) {
      alert('Please fill in all fields to create a meeting.');
      return;
    }

    this.newMeeting.createdAt = new Date();
    this.newMeeting.host = this.currentUser;

    this.authService.createMeeting(this.newMeeting).subscribe(
      (response) => {
        console.log('Meeting created:', response);
        this.showToast('Meeting created successfully!');
        this.newMeeting = { title: '', description: '', createdAt: null, host: '' };
        this.fetchMeetings();
      },
      (error) => {
        console.error('Error creating meeting:', error);
        this.showToast('Failed to create meeting.', 'error');
      }
    );
  }

  editMeeting(meeting: any): void {
    if (meeting.host !== this.currentUser) {
      alert('You can only edit meetings created by you.');
      return;
    }

    const newTitle = prompt('Enter new title', meeting.title);
    if (!newTitle) return;

    const updatedMeeting = { ...meeting, title: newTitle };

    this.authService.updateMeeting(updatedMeeting).subscribe(
      (response) => {
        console.log('Meeting updated:', response);
        this.showToast('Meeting updated successfully!');
        this.fetchMeetings();
      },
      (error) => {
        console.error('Error updating meeting:', error);
        this.showToast('Failed to update meeting.', 'error');
      }
    );
  }

  deleteMeeting(meetingId: number): void {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    this.authService.deleteMeeting(meetingId).subscribe(
      (response) => {
        console.log('Meeting deleted:', response);
        this.showToast(response.message || 'Meeting deleted successfully!');
        this.fetchMeetings();
      },
      (error) => {
        console.error('Error deleting meeting:', error);
        this.showToast('Failed to delete meeting.', 'error');
      }
    );
  }

  startVideoCall(meetingId: number): void {
    console.log('Navigating to video call with meeting ID:', meetingId);
    this.router.navigate(['/video-call', meetingId]).catch((error) => {
      console.error('Navigation error:', error);
    });
  }
  

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    // Placeholder for toast notifications
    console.log(`[${type.toUpperCase()}] ${message}`);
  }
}
