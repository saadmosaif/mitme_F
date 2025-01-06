import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  imports: [RouterModule], // Import RouterModule here
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css'],
})
export class MeetingListComponent {
  meetings = [
    { id: '1', title: 'Daily Standup' },
    { id: '2', title: 'Project Review' },
  ];
}
