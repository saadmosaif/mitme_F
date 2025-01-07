import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeetingService } from '../../shared/meeting.service';

@Component({
  selector: 'app-meeting-details',
  standalone: true,
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css'],
})
export class MeetingDetailsComponent implements OnInit {
  meetingId: string | null = null;
  meetingDetails: any = null;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) {}

  ngOnInit() {
    this.meetingId = this.route.snapshot.paramMap.get('id');
    if (this.meetingId) {
      this.fetchMeetingDetails();
    }
  }

  fetchMeetingDetails() {
    this.meetingService.getMeetingDetails(this.meetingId!).subscribe(
      (response) => {
        this.meetingDetails = response; // Populate meeting details
      },
      (error) => {
        console.error('Error fetching meeting details:', error);
      }
    );
  }
}
