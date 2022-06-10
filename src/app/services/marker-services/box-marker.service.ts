import { Injectable } from '@angular/core';
import { Feature } from 'geojson';
import * as L from 'leaflet';
import { Box } from 'src/app/interfaces/box';

@Injectable({
  providedIn: 'root'
})
export class BoxMarkerService {

  //TODO via config ? => could range from customer to customer
  private criticalColor = '#ff3333';
  private normalColor = '#5E8B7E';
  private goodColor = '#305D63';

  // TODO depends on which kind of box => decide in mapping
  private boxRadius = 3000;

  constructor() { }

  createMarkers(boxes: Box[]): L.Circle[] {
    return boxes.map(box => this.createMarker(box));
  }

  createMarker(box: Box): L.Circle<Box> {
    let c = L.circle(
      [box.locationLat, box.locationLong],
      { radius: this.boxRadius, color: this.mapStatustoColor(box.batteryStatus) }
    )
      .bindPopup(this.boxPopup(box));
    c.feature = { type: "Feature", properties: box, geometry: { type: "Point", coordinates: [box.locationLat, box.locationLong]}}
    return c;
  }

  private mapStatustoColor(battery: number): string {
    return battery > 33 ? battery > 75 ? this.goodColor : this.normalColor : this.criticalColor;
  }

  private boxPopup(data: Box): string {
    return `<h4 style="font-size:16pt;">${data.name}<h4><table>
    <tr><td><b>First Signal:</b></td><td>${new Date(data.registeredAt * 1000).toDateString().split(' ').slice(1).join(' ')} ${new Date(data.registeredAt * 1000).toLocaleTimeString()}</td></tr>
    <tr><td><b>Last Signal:</b></td><td>${new Date(data.lastHeartbeat * 1000).toDateString().split(' ').slice(1).join(' ')} ${new Date(data.lastHeartbeat * 1000).toLocaleTimeString()}</td></tr>
    <tr><td><b>Connectivity:</b></td><td>${data.connectivityStatus}/100</td></tr>
    <tr><td><b>Battery:</b></td><td>${data.batteryStatus}/100</td></tr>
    <tr><td><b>Location:</b></td><td>${data.locationLat}° N,<br>${data.locationLong}° E</td></tr>
    <tr><td><b>Detections:</b></td><td>${data.detectionCount}</td></tr></table>`
  }
}
