import { Component, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for *ngFor and *ngIf
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add CommonModule and FormsModule
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.css'],
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;

  private localStream!: MediaStream;
  private peerConnection!: RTCPeerConnection;
  private signalingServer!: WebSocket;
  meetingId: string | null = null;
  currentUser: string = '';
  participants: string[] = []; // List of participants in the meeting
  chatInput: string = ''; // Chat input model
  chatMessages: { user: string; message: string }[] = []; // Chat messages
  isAudioMuted = false;
isVideoMuted = false;
private mediaRecorder!: MediaRecorder;
private recordedChunks: Blob[] = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('[DEBUG] VideoCallComponent initialized');
    this.validateToken();

    // Get meeting ID from route
    this.meetingId = this.route.snapshot.paramMap.get('id');
    if (!this.meetingId) {
      console.warn('[DEBUG] No meeting ID found, redirecting to meeting page');
      this.router.navigate(['/meeting']);
      return;
    }
    console.log('[DEBUG] Meeting ID:', this.meetingId);

    this.currentUser = this.getCurrentUser();
    console.log('[DEBUG] Current user:', this.currentUser);

    // Initialize WebSocket connection
    this.initializeSignalingServer();
  }

  ngOnDestroy(): void {
    this.cleanupResources();
  }

  private validateToken(): void {
    const token = localStorage.getItem('authToken');
    console.log('[DEBUG] Retrieved Token:', token);
    if (!token) {
      console.warn('[DEBUG] No token found, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  private getCurrentUser(): string {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        return payload.sub || 'Unknown User'; // Extract username
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
    return 'Unknown User';
  }

  private initializeSignalingServer(): void {
    try {
      this.signalingServer = new WebSocket('ws://localhost:8080/signaling');
      this.signalingServer.onopen = () => {
        console.log('Connected to the signaling server');
        this.signalingServer.send(
          JSON.stringify({
            type: 'join',
            meetingId: this.meetingId,
            username: this.currentUser,
          })
        );
      };

      this.signalingServer.onmessage = (message) => this.handleSignalingMessage(message);
      this.signalingServer.onerror = (error) => {
        console.error('Signaling server error:', error);
        alert('Unable to connect to the signaling server.');
      };
    } catch (error) {
      console.error('Error initializing signaling server:', error);
    }
  }

  private async handleSignalingMessage(message: MessageEvent): Promise<void> {
    try {
      const data = JSON.parse(message.data);
      switch (data.type) {
        case 'chat':
          this.chatMessages.push({
            user: data.user,
            message: data.message,
          });
          break;
        case 'offer':
          await this.handleOffer(data.offer);
          break;
        case 'answer':
          await this.handleAnswer(data.answer);
          break;
        case 'candidate':
          await this.handleCandidate(data.candidate);
          break;
        default:
          console.warn('Unknown signaling message type:', data.type);
      }
    } catch (error) {
      console.error('Error processing signaling message:', error);
    }
  }
  

  async startCall(): Promise<void> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      this.localVideo.nativeElement.srcObject = this.localStream;

      this.peerConnection = this.createPeerConnection();
      this.localStream.getTracks().forEach((track) => this.peerConnection.addTrack(track, this.localStream));

      const offer = await this.peerConnection.createOffer();
      await this.peerConnection.setLocalDescription(offer);

      this.signalingServer.send(JSON.stringify({ type: 'offer', offer }));
      console.log('Offer sent to signaling server');
    } catch (error) {
      console.error('Error starting call:', error);
    }
  }

  private createPeerConnection(): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    pc.ontrack = (event) => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.signalingServer.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
      }
    };

    return pc;
  }

  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    this.peerConnection = this.createPeerConnection();
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);

    this.signalingServer.send(JSON.stringify({ type: 'answer', answer }));
    console.log('Answer sent to signaling server');
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('Remote description set');
  }

  private async handleCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    console.log('ICE candidate added');
  }

  endCall(): void {
    this.cleanupResources();
    console.log('Call ended');
  }

  private cleanupResources(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
    if (this.signalingServer) {
      this.signalingServer.close();
    }
  }
  sendChatMessage(): void {
    if (this.chatInput.trim() === '') {
      console.warn('[DEBUG] Empty message, not sending.');
      return;
    }
  
    // Construct the chat message
    const chatMessage = {
      type: 'chat',
      meetingId: this.meetingId,
      user: this.currentUser,
      message: this.chatInput,
    };
  
    console.log('[DEBUG] Sending chat message:', chatMessage);
  
    // Send the message through WebSocket
    this.signalingServer.send(JSON.stringify(chatMessage));
    this.chatInput = ''; // Clear the input field
  }
  async startScreenShare(): Promise<void> {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.getVideoTracks()[0];
  
      // Replace video track in the PeerConnection
      const sender = this.peerConnection.getSenders().find(s => s.track?.kind === 'video');
      if (sender) {
        sender.replaceTrack(screenTrack);
      }
  
      screenTrack.onended = () => {
        // Revert back to the webcam when screen sharing stops
        const webcamTrack = this.localStream.getVideoTracks()[0];
        if (sender) sender.replaceTrack(webcamTrack);
      };
    } catch (error) {
      console.error('Error sharing screen:', error);
    }
  }
  toggleAudio(): void {
    this.localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    this.isAudioMuted = !this.isAudioMuted;
  }
  
  toggleVideo(): void {
    this.localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    this.isVideoMuted = !this.isVideoMuted;
  }
  startRecording(): void {
    try {
      const stream = new MediaStream([...this.localStream.getTracks(), ...this.peerConnection.getReceivers().map(r => r.track!).filter(Boolean)]);
      this.mediaRecorder = new MediaRecorder(stream);
  
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
  
      this.mediaRecorder.start();
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  }
  
  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meeting-${this.meetingId}.webm`;
      a.click();
      console.log('Recording stopped and downloaded');
    }
  }
  
  
}
