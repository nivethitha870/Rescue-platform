import { Component, AfterViewInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-selector',
  template: `<div id="map" style="height: 400px; border-radius: 8px; width: 100%;"></div>`,
  standalone: true,
})
export class MapSelectorComponent implements AfterViewInit {
  @Output() locationSelected = new EventEmitter<{ lat: number, lng: number }>();
  private map!: L.Map;
  private marker: L.Marker | undefined;

  // THE FIX: Use L.divIcon for the selection marker
  private selectionIcon = L.divIcon({
    className: 'selection-marker-icon',
    iconSize: [16, 16]
  });

  ngAfterViewInit(): void {
    this.initMap();
    this.centerOnUserLocation();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [20.5937, 78.9629],
      zoom: 5
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    setTimeout(() => { this.map.invalidateSize(); }, 0);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.updateMarker(e.latlng);
    });
  }

  private centerOnUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const latlng = { lat: position.coords.latitude, lng: position.coords.longitude };
        this.map?.setView(latlng, 13);
        this.updateMarker(latlng);
      });
    }
  }
  
  private updateMarker(latlng: L.LatLngExpression): void {
    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      // THE FIX: Create the marker using our new divIcon
      this.marker = L.marker(latlng, { icon: this.selectionIcon }).addTo(this.map!);
    }
    
    if ('lat' in latlng && 'lng' in latlng) {
        this.locationSelected.emit({ lat: latlng.lat, lng: latlng.lng });
    }
  }
}