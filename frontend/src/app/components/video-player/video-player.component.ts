import { Component, EventEmitter, Input, Output, HostListener, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="video-overlay" (click)="onClose()" *ngIf="isOpen">
      <div class="video-container" (click)="$event.stopPropagation()">
        <button class="close-btn" (click)="onClose()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <video
          #videoPlayer
          [src]="videoUrl"
          controls
          autoplay
          playsinline
          class="video-element"
          (ended)="onVideoEnded()"
        ></video>

        <div class="video-info" *ngIf="title">
          <h3>{{ title }}</h3>
        </div>

        <div class="controls-help" *ngIf="showHelp">
          <p><strong>Space:</strong> Play/Pause</p>
          <p><strong>←/→:</strong> Seek ±10s</p>
          <p><strong>M:</strong> Mute</p>
          <p><strong>F:</strong> Fullscreen</p>
          <p><strong>ESC:</strong> Close</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .video-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.95);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .video-container {
      position: relative;
      width: 90%;
      max-width: 1200px;
      background: black;
      border-radius: 8px;
      overflow: hidden;
    }

    .close-btn {
      position: absolute;
      top: -40px;
      right: 0;
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      z-index: 10;
      padding: 5px;
    }

    .close-btn:hover {
      opacity: 0.7;
    }

    .video-element {
      width: 100%;
      aspect-ratio: 16/9;
      background: black;
    }

    .video-info {
      padding: 15px 20px;
      background: #181818;
    }

    .video-info h3 {
      font-size: 18px;
      font-weight: 600;
    }

    .controls-help {
      position: absolute;
      bottom: 80px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px 20px;
      border-radius: 8px;
      font-size: 13px;
      animation: fadeOut 5s forwards;
    }

    .controls-help p {
      margin: 5px 0;
      color: #d2d2d2;
    }

    @keyframes fadeOut {
      0%, 80% { opacity: 1; }
      100% { opacity: 0; }
    }
  `]
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  @Input() isOpen = false;
  @Input() videoUrl = '';
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  showHelp = true;
  private helpTimeout: any;

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.showHelp = true;
      this.helpTimeout = setTimeout(() => {
        this.showHelp = false;
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.helpTimeout) {
      clearTimeout(this.helpTimeout);
    }
  }

  @HostListener('document:keydown.escape')
  onEscKey(): void {
    if (this.isOpen) {
      this.onClose();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen || !this.videoPlayer) return;

    const video = this.videoPlayer.nativeElement;

    switch (event.key) {
      case ' ':
        event.preventDefault();
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        video.currentTime = Math.max(0, video.currentTime - 10);
        break;
      case 'ArrowRight':
        event.preventDefault();
        video.currentTime = Math.min(video.duration, video.currentTime + 10);
        break;
      case 'm':
      case 'M':
        event.preventDefault();
        video.muted = !video.muted;
        break;
      case 'f':
      case 'F':
        event.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          video.requestFullscreen();
        }
        break;
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onVideoEnded(): void {
    // Video ended
  }
}
