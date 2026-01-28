import { Component, inject, AfterViewInit } from '@angular/core';
import { StatsCardComponent } from '../stats-card/stats-card.component';
import { DOCUMENT, NgClass } from '@angular/common';

type CardPosition = '1' | '2' | '3' | '4';

@Component({
  selector: 'app-statistics-stats-card-container',
  imports: [StatsCardComponent, NgClass],
  templateUrl: './stats-card-container.component.html',
  styleUrl: './stats-card-container.component.scss',
})
export class StatsCardContainerComponent implements AfterViewInit {
  private doc = inject(DOCUMENT);
  private observer!: IntersectionObserver;

  public carouselActiveDotIndex: CardPosition = '1';

  ngAfterViewInit(): void {
    this.observeCards();
  }

  observeCards(): void {
    this.observer = new IntersectionObserver(
      entries => {
        const intersectingEntry = entries.find(entry => entry.isIntersecting);
        if (intersectingEntry) {
          this.carouselActiveDotIndex = intersectingEntry.target.id as CardPosition;
        }
      },
      { threshold: 0.5 }
    );

    (['1', '2', '3', '4'] as CardPosition[]).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        this.observer.observe(element);
      }
    });
  }

  scrollToCard(id: CardPosition): void {
    this.carouselActiveDotIndex = id;
    this.doc.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
