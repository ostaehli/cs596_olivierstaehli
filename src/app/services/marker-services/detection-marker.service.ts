import { Injectable } from '@angular/core';
import { WildlifeDetection } from 'src/app/interfaces/WildlifeDetection';
import * as L from 'leaflet';
import { getIconWithIconUrl } from 'src/app/utils/animalToIcon';
import { getMediaDisplayHTML } from 'src/app/utils/mediaDisplay';

@Injectable({
  providedIn: 'root'
})
export class DetectionMarkerService {

  constructor() { }

  createMarkers(detection: WildlifeDetection[]): L.Marker[] {
    return detection.map(d => this.createMarker(d));
  }

  createMarker(d: WildlifeDetection): L.Marker<WildlifeDetection> {
    const options: L.MarkerOptions = {};
    let m = L.marker([d.locationLat, d.locationLong], { icon: getIconWithIconUrl(d.icon) })
      .bindPopup(this.destinationPopup(d));
    m.feature = { type: "Feature", properties: d, geometry: { type: "Point", coordinates: [d.locationLat, d.locationLong] } }
    return m;
  }

  private destinationPopup(data: WildlifeDetection): string {
    return `<h4 style="font-size:16pt;"></td><td>${data.animalName}<h4><table>
    <tr><td><b>Detected on:</b></td><td>${new Date(data.recordedAt).toDateString().split(' ').slice(1).join(' ')} ${new Date(data.recordedAt).toLocaleTimeString()}</td></tr>
    <tr><td><b>Method:</b></td><td>${data.method}</td></tr>
    <tr><td><b>Location:</b></td><td>${data.locationLat}° N,<br>${data.locationLong}° E</td></tr>
    <tr><td><b>Individuals:</b></td><td>${data.total}</td></tr>
    <tr><td colspan="2"><b><i>Females:</b> ${data.female}, <b>Males:</b> ${data.male}, <b>Offspring:</b> ${data.offspring}</i></td></tr></table>
    <tr><td colspan="2">${getMediaDisplayHTML(data)}</td></tr></table>
`
  }

}
