import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { LocationEvent } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  locationMarker: L.Marker | undefined;
  locationCircle: L.Circle | undefined;

  locate(map: L.Map) {
    map.locate({watch: false, enableHighAccuracy: true})
    .once('locationfound', (e) => {
      map.flyToBounds(e.latlng.toBounds(e.accuracy));
    })
    .on('locationfound', (e) => this.updateLocation(e, map))
    .on('locationerror', (e) => {console.error(e)});
  }

  updateLocation(e: LocationEvent, map: L.Map) {
    if (this.locationMarker) {
      map.removeLayer(this.locationMarker);
    }
    if (this.locationCircle) {
      map.removeLayer(this.locationCircle);
    }
    const radius = e.accuracy / 2;
    const latlng = e.latlng;
    let icon = this.getIcon();

    this.locationMarker = L.marker(latlng, {icon: icon}).addTo(map);
    this.locationCircle = L.circle(latlng, radius, {stroke: false}).addTo(map);
    //@ts-ignore
    this.locationMarker._icon.classList.remove('disabled');

  }

  stopLocaton(map: L.Map) {
    //@ts-ignore
    this.locationMarker._icon.classList.add('disabled');
    map.stopLocate();
  }

  private getIcon(): L.DivIcon {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" version="1.1" viewBox="-12 -12 24 24"><circle r="9" style="stroke:#fff;stroke-width:3;fill-opacity:1;opacity:1;"></circle></svg>';

    let iconSize = 20;

    return L.divIcon({
      html: svg,
        iconSize: [iconSize, iconSize],
        iconAnchor: [iconSize/2, iconSize/2],
        popupAnchor: [0, 0],
        className: 'location-marker'
    });
  }
}
