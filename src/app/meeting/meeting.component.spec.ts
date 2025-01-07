import { Component, OnInit } from '@angular/core';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent implements OnInit {
  meetings: any[] = []; // Array to hold the list of meetings
  errorMessage: string = ''; // For error messages

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchMeetings(); // Fetch meetings when the component initializes
  }

  fetchMeetings(): void {
    this.authService.getMeetings().subscribe(
      (response) => {
        console.log('Meetings fetched successfully:', response);
        this.meetings = response; // Assign the fetched meetings to the array
      },
      (error) => {
        console.error('Error fetching meetings:', error);
        if (error.status === 403) {
          this.errorMessage = 'Unauthorized: Please log in again.';
        } else {
          this.errorMessage = 'Failed to load meetings. Please try again later.';
        }
        alert(this.errorMessage);
      }
    );
  }
}
