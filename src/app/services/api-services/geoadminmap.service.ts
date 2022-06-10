import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet'

@Injectable({
  providedIn: 'root'
})
export class GeoadminmapService {
  /*
    ToS: https://www.geo.admin.ch/en/geo-services/geo-services/terms-of-use.html
    The acquisition and use of data or services is free of charge, subject to the provisions on fair use.
    The integration of geoservices in web applications with an average of 10,000 users per day or desktop applications corresponds to fair use.
  */
  constructor(private http: HttpClient) {
    
   }

  init(control: L.Control.Layers) {
    const tileArealStatistik = L.tileLayer('https://wmts0.geo.admin.ch/1.0.0/ch.bfs.arealstatistik/default/2018/3857/{z}/{x}/{y}.png', { attribution: '&copy; <a href="api3.geo.admin.ch">GeoAdmin</a>', opacity: 0.5 });
    //control.addOverlay(tileArealStatistik, "GeoAdmin: Arealstatistik (Wälder)");
    const tileGemeinde = L.tileLayer('https://wmts0.geo.admin.ch/1.0.0/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/default/current/3857/{z}/{x}/{y}.png', { attribution: '&copy; <a href="api3.geo.admin.ch">GeoAdmin</a>' });
    control.addOverlay(tileGemeinde, "Swiss Municipal Areas");

  }
  /*
    addressSearch(searchstring: string, control: L.Control.Layers, map: L.Map) {
      // Usage this.addressSearch('Salvenachstrasse', control, map);
      let path = `https://api3.geo.admin.ch/rest/services/api/MapServer/find?layer=ch.swisstopo.amtliches-strassenverzeichnis&searchText=${searchstring}&searchField=label&returnGeometry=true&contains=false&geometryFormat=geojson&sr=4326`
      this.http.get(path).subscribe(data => {
        let gjL = L.geoJSON((data as any).results[0]);
        control.addOverlay(gjL, 'GEO');
      })
    }*/
}

