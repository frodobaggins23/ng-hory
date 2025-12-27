import {
  Component,
  Input,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { MapTrackService } from '../../../services/new-ui/map-track.service';
import { MAPY_CZ_URL } from '../../../constants';

@Component({
  selector: 'app-track-map',
  imports: [],
  templateUrl: './track-map.component.html',
  styleUrl: './track-map.component.scss',
  providers: [MapTrackService],
})
export class TrackMapComponent implements AfterViewInit, OnDestroy {
  @Input() track!: GeoJSON.GeoJsonObject;
  @Input() climbId!: number;

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private mapService = inject(MapTrackService);
  private viewContainerRef = inject(ViewContainerRef);

  ngAfterViewInit(): void {
    if (!this.track) {
      console.warn('TrackMapComponent: No track data provided');
      return;
    }

    // Initialize map and show track
    this.mapService.initMap(this.mapContainer.nativeElement, MAPY_CZ_URL);
    this.mapService.showTrack(this.track, this.viewContainerRef);
  }

  ngOnDestroy(): void {
    this.mapService.destroyMap();
  }
}
