import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private messages = new Subject<string>();

  getMessages(): Observable<string> {
    return this.messages.asObservable();
  }

  sendMessage(message: string) {
    this.messages.next(message);
  }
}
