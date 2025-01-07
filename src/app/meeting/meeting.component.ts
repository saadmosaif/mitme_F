import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common'; // Import CommonModule for pipes like 'date'

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule], // Add CommonModule for pipes
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  meetings: any[] = []; // Array to hold the list of meetings
  errorMessage: string | null = null; // Error message if fetching fails

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMeetings();
  }

  /**
   * Fetch the list of meetings from the backend.
   */
  fetchMeetings(): void {
    this.authService.getMeetings().subscribe(
      (response) => {
        console.log('Meetings fetched successfully:', response);
        this.meetings = response; // Assign response to meetings
      },
      (error) => {
        console.error('Error fetching meetings:', error);
        this.errorMessage = 'Failed to load meetings. Please check your authorization.';
      }
    );
  }

  /**
   * Join a specific meeting by navigating to its details page.
   * @param meetingId - The ID of the meeting to join
   */
  joinMeeting(meetingId: string): void {
    console.log('Joining meeting with ID:', meetingId);
    this.router.navigate([`/meeting/${meetingId}`]); // Navigate to the meeting details page
  }
}
