import { Component, Input, OnChanges, SimpleChanges, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { FacilityService } from '../../../services/facility';

@Component({
  selector: 'app-case-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div id="volunteer-map" style="height: 500px; width: 100%; border-radius: 12px;"></div>`
})
export class CaseMapComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() cases: any[] = [];
  private map!: L.Map;
  private caseMarkersLayer = L.layerGroup();
  private volunteerMarker: L.Marker | undefined;
  
  private facilities: any[] = [];
  private routingControl: L.Routing.Control | null = null;

  // THE FIX: Define markers using L.divIcon and our new CSS classes
  private commonIconOptions = {
    iconSize: [16, 16] as L.PointExpression,
    className: '' // Base class, will be overridden
  };

  private caseIcon = L.divIcon({ ...this.commonIconOptions, className: 'case-marker-icon' });
  private volunteerIcon = L.divIcon({ ...this.commonIconOptions, className: 'volunteer-marker-icon' });
  private facilityIcon = L.divIcon({ ...this.commonIconOptions, className: 'facility-marker-icon' });

  constructor(private facilityService: FacilityService) {}

  ngOnInit(): void {
    this.facilityService.getFacilities().subscribe(data => {
      this.facilities = data;
      if (this.map) {
        this.addFacilityMarkers();
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.updateCaseMarkers();
    this.trackVolunteerLocation();
    this.addFacilityMarkers();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cases'] && this.map) {
      this.updateCaseMarkers();
    }
  }
  private initMap(): void { this.map = L.map('volunteer-map', { center: [20.5937, 78.9629], zoom: 5 }); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '© OpenStreetMap' }).addTo(this.map); this.caseMarkersLayer.addTo(this.map); setTimeout(() => this.map.invalidateSize(), 0); }
  private addFacilityMarkers(): void { if (!this.map || this.facilities.length === 0) return; this.facilities.forEach(facility => { const [lng, lat] = facility.location.coordinates; L.marker([lat, lng], { icon: this.facilityIcon }).addTo(this.map).bindPopup(`<b>${facility.name}</b><br>${facility.type}`); }); }
  private updateCaseMarkers(): void { this.caseMarkersLayer.clearLayers(); this.cases.forEach(caseItem => { if (caseItem.location && caseItem.location.coordinates) { const [lng, lat] = caseItem.location.coordinates; const marker = L.marker([lat, lng], { icon: this.caseIcon }).bindPopup(`<b>${caseItem.animal} - ${caseItem.caseType}</b><br>Click to find nearest vet`).on('click', () => { this.calculateShortestPath(caseItem); }); this.caseMarkersLayer.addLayer(marker); } }); }
  
  private calculateShortestPath(caseItem: any): void {
    if (this.facilities.length === 0) {
      alert('Facility locations are still loading. Please try again in a moment.');
      return;
    }

    const caseLocation = L.latLng(caseItem.location.coordinates[1], caseItem.location.coordinates[0]);

    let nearestFacility: any = null;
    let shortestDistance = Infinity;

    this.facilities.forEach(facility => {
      const facilityLocation = L.latLng(facility.location.coordinates[1], facility.location.coordinates[0]);
      const distance = caseLocation.distanceTo(facilityLocation);
      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestFacility = facility;
      }
    });

    if (!nearestFacility) {
        alert('Could not find a nearby facility.');
        return;
    }
    
    const nearestFacilityLocation = L.latLng(nearestFacility.location.coordinates[1], nearestFacility.location.coordinates[0]);

    if (this.routingControl) {
      this.map.removeControl(this.routingControl);
    }
    
    const plan = new L.Routing.Plan([
        caseLocation,
        nearestFacilityLocation
    ], {
        // THE FIX 1: Return 'false' instead of 'null' to satisfy the TypeScript type definition.
        createMarker: () => false
    });

    this.routingControl = L.Routing.control({
      plan: plan,
      routeWhileDragging: false,
      // THE FIX 2: Remove the 'lineOptions' property to avoid the complex type error.
      // The route will now use the default (blue) line style.
    }).addTo(this.map);
  }

  // --- trackVolunteerLocation (no changes) ---
  private trackVolunteerLocation(): void { if (navigator.geolocation) { navigator.geolocation.watchPosition((position) => { const { latitude, longitude } = position.coords; const latLng = L.latLng(latitude, longitude); if (!this.volunteerMarker) { this.volunteerMarker = L.marker(latLng, { icon: this.volunteerIcon }).addTo(this.map).bindPopup('<b>Your Location</b>'); this.map.setView(latLng, 13); } else { this.volunteerMarker.setLatLng(latLng); } }, (err) => { console.warn(`Could not get location: ${err.message}`); }, { enableHighAccuracy: true }); } }
}