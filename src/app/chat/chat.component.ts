import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  messages: { sender: string; text: string }[] = [];
  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.messages.push({ sender: 'You', text: this.newMessage });
      this.newMessage = ''; // Clear the input
    }
  }
}
