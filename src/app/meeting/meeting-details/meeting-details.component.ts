import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MeetingService } from '../../shared/meeting.service';

@Component({
  selector: 'app-meeting-details',
  standalone: true,
  templateUrl: './meeting-details.component.html',
  styleUrls: ['./meeting-details.component.css'],
})
export class MeetingDetailsComponent {
  meeting: any;

  constructor(
    private route: ActivatedRoute,
    private meetingService: MeetingService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.meetingService.getMeeting(id!).subscribe(
      (data) => {
        this.meeting = data;
      },
      (error) => {
        console.error('Error fetching meeting details:', error);
      }
    );
  }
}
