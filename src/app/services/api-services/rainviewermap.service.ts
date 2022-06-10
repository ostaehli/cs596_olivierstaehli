import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as L from 'leaflet'
import { RainViewerImagePathResponse } from 'src/app/interfaces/RainViewerImagePathResponse';

@Injectable({
  providedIn: 'root'
})
export class RainviewermapService {

  constructor(private http: HttpClient) { }

  _checkCoverage(control: L.Control.Layers): void {
    let path = 'https://tilecache.rainviewer.com/v2/coverage/0/256/{z}/{x}/{y}/0/0_0.png';
    const tile = L.tileLayer(path, { attribution: '&copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>' });

    control.addOverlay(tile, "RainViewer Coverage");
  }

  init(control: L.Control.Layers) {
    this.getAPIImagePath().then(path => {
      let APIPath = `https://tilecache.rainviewer.com/v2/radar/${path}/512/{z}/{x}/{y}/1/0_0.png`;
    const tile = L.tileLayer(APIPath, { attribution: '&copy; <a href="https://www.rainviewer.com/api.html">RainViewer</a>' });

    control.addOverlay(tile, "Rain");
    });

  }

  getAPIImagePath(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get<RainViewerImagePathResponse>('https://api.rainviewer.com/public/weather-maps.json').subscribe(
        {
          next: (data: RainViewerImagePathResponse) => {
            resolve(data.radar.nowcast[0].path)
          },
          error: (err: any) => {console.error(err)}
        }
      );
    });
  }
}
