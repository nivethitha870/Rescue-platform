import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-single-case-map',
  standalone: true,
  imports: [],
  template: `<div [id]="mapId" style="height: 250px; width: 100%; border-radius: 8px;"></div>`,
})
export class SingleCaseMapComponent implements AfterViewInit, OnChanges {
  @Input() case: any;
  public mapId = `single-map-${Math.random().toString(36).substring(2)}`;
  private map!: L.Map;
  private marker: L.Marker | undefined;

  // THE FIX: Use L.divIcon for the case marker
  private caseIcon = L.divIcon({
    className: 'case-marker-icon',
    iconSize: [16, 16]
  });

  ngAfterViewInit(): void {
    if (this.case) {
      this.initMap();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['case'] && this.map && this.case) {
      this.updateMap();
    } else if (changes['case'] && !this.map && this.case) {
        // Handle case where map needs to be initialized on change
        this.initMap();
    }
  }

  private initMap(): void {
    if (!this.case?.location?.coordinates) return;
    const [lng, lat] = this.case.location.coordinates;
    
    this.map = L.map(this.mapId, {
      center: [lat, lng],
      zoom: 14
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);

    // THE FIX: Create marker with the new divIcon
    this.marker = L.marker([lat, lng], { icon: this.caseIcon }).addTo(this.map);

    setTimeout(() => this.map.invalidateSize(), 0);
  }

  private updateMap(): void {
    if (!this.case?.location?.coordinates) return;
    const [lng, lat] = this.case.location.coordinates;
    const latLng = L.latLng(lat, lng);
    this.map.setView(latLng, 14);
    this.marker?.setLatLng(latLng);
  }
}