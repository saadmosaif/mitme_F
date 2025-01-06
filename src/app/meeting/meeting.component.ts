import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MeetingService } from '../shared/meeting.service';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [HttpClientModule], // Import HttpClientModule
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
})
export class MeetingComponent {
  constructor(private meetingService: MeetingService) {}
}
