import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-meeting-list',
  standalone: true,
  templateUrl: './meeting-list.component.html',
  styleUrls: ['./meeting-list.component.css'],
})
export class MeetingListComponent {
  @Input() meetings: any[] = []; // List of meetings passed from the parent component
}
