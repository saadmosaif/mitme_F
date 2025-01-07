import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  meetings: any[] = []; // Array to store meetings
  newMeeting = { title: '', description: '', createdAt: new Date() as Date | null, host: '' }; // Allow Date or null

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchMeetings(); // Fetch meetings on component load
  }

  // Fetch meetings from the backend
  fetchMeetings(): void {
    this.authService.getMeetings().subscribe(
      (response) => {
        this.meetings = response;
      },
      (error) => {
        console.error('Error fetching meetings:', error);
        alert('Failed to load meetings. Please check your authorization.');
      }
    );
  }

  // Create a new meeting
  createMeeting(): void {
    // Validate that form fields are not empty
    if (!this.newMeeting.title || !this.newMeeting.description) {
      alert('Please fill in all the fields to create a meeting.');
      return;
    }

    // Add additional fields like createdAt and host dynamically
    this.newMeeting.createdAt = new Date(); // Assign the current date
    this.newMeeting.host = 'CurrentUser'; // Replace this with actual logged-in user info

    this.authService.createMeeting(this.newMeeting).subscribe(
      (response) => {
        console.log('Meeting created:', response);
        alert('Meeting created successfully!');
        this.newMeeting = { title: '', description: '', createdAt: null, host: '' }; // Reset the form
        this.fetchMeetings(); // Refresh the meetings list
      },
      (error) => {
        console.error('Error creating meeting:', error);
        alert('Failed to create meeting.');
      }
    );
  }

  // Edit an existing meeting
  editMeeting(meeting: any): void {
    const updatedMeeting = {
      ...meeting,
      title: prompt('Enter new title', meeting.title) || meeting.title, // Allow user to input new title
    };

    this.authService.updateMeeting(updatedMeeting).subscribe(
      (response) => {
        alert('Meeting updated successfully!');
        this.fetchMeetings(); // Refresh the meetings list
      },
      (error) => {
        console.error('Error updating meeting:', error);
        alert('Failed to update meeting.');
      }
    );
  }

  // Delete a meeting
  deleteMeeting(meetingId: number): void {
    if (confirm('Are you sure you want to delete this meeting?')) {
      this.authService.deleteMeeting(meetingId).subscribe(
        (response) => {
          alert('Meeting deleted successfully!');
          this.fetchMeetings(); // Refresh the meetings list
        },
        (error) => {
          console.error('Error deleting meeting:', error);
          alert('Failed to delete meeting.');
        }
      );
    }
  }
}
