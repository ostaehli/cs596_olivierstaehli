import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ignoreElements, Observable, of, shareReplay } from 'rxjs';
import { Report } from 'src/app/interfaces/report';
import { WildlifeDetection } from 'src/app/interfaces/WildlifeDetection';


@Injectable({
  providedIn: 'root'
})
export class WildlifeDetectionApiService {
  private data: Observable<WildlifeDetection[]> | undefined;
  constructor(@Inject("BACKEND_URL") private url: string, private client: HttpClient) {
  }

  getwildlifeData(): Observable<WildlifeDetection[]> {
    return this.data = this.data || this.client.get<WildlifeDetection[]>(`${this.url}/data/`).pipe(
      shareReplay(1)
    )
  }

  createDetection(detection: Report): Observable<any> {
    return this.client.post(`${this.url}/data/manual`, detection);
  }

  invalidateCache() {
    this.data = undefined;
  }

  deleteAnimal(animal: WildlifeDetection): Observable<void> {
    return this.client.delete<void>(`${this.url}/data/manual/${animal.id}`, {body: {}});
  }

}
