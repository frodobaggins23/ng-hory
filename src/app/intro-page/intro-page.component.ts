import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';

const SCROLL_THRESHOLD = 15;

@Component({
  selector: 'app-intro-page',
  templateUrl: './intro-page.component.html',
  styleUrls: ['./intro-page.component.scss'],
})
export class IntroPageComponent implements AfterViewInit, OnDestroy {
  @Input() scrolled = false;
  @Output() scrolledPast = new EventEmitter<void>();
  private scrollHandler = this.onScroll.bind(this);
  private isPast = false;

  ngAfterViewInit() {
    window.addEventListener('scroll', this.scrollHandler);
    this.attachVideo()
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  private attachVideo() {
    const videoElement = window.document.getElementById("video") as HTMLSourceElement;
    const source = videoElement.dataset['src'];
    if (videoElement && source) {
      videoElement.src = source;
      (videoElement.parentElement as HTMLVideoElement)?.load();
    }
  }

  private onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    this.checkScrollThreshold(scrollY);
  }

  private checkScrollThreshold(scrollY: number) {
    if (!this.isPast && scrollY > SCROLL_THRESHOLD) {
      this.isPast = true;
      this.scrolledPast.emit();
      console.log('Scrolled past the threshold');
    }
  }
}
