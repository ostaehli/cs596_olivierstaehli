import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Box } from 'src/app/interfaces/box';

@Injectable({
  providedIn: 'root'
})
export class BoxApiService {


  private data: Observable<Box[]>

  constructor(@Inject('BACKEND_URL') private url: string, private client: HttpClient) {
  }

  getBoxes(): Observable<Box[]> {
    return this.data = this.data || this.client.get<Box[]>(`${this.url}/devices/`).pipe(
      shareReplay(1)
    );
  }
}

