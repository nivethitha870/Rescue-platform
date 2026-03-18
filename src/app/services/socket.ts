import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
// THE FIX: The "export" keyword is required here.
export class SocketService {
  private socket: Socket;
  private readonly serverUrl = 'http://localhost:5000'; // Your backend URL

  constructor() {
    this.socket = io(this.serverUrl);
  }

  listen<T>(eventName: string): Observable<T> {
    return new Observable(subscriber => {
      this.socket.on(eventName, (data: T) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}