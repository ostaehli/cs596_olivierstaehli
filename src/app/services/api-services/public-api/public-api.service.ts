import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { Animal } from 'src/app/interfaces/animal';

@Injectable({
  providedIn: 'root'
})
export class PublicApiService {

  private methods$: Observable<string[]>;
  private animals$: Observable<Animal[]>;

  constructor(@Inject("BACKEND_URL") private url: string, private client: HttpClient) { }

  getDetectionMethods(): Observable<string[]> {
    return this.methods$ = this.methods$ ?? this.client.get<string[]>(`${this.url}/public/methods`).pipe(
      shareReplay(1)
    );
  }

  getAnimals(): Observable<Animal[]> {
    return this.animals$ = this.animals$ ?? this.client.get<Animal[]>(`${this.url}/public/animals`).pipe(
      shareReplay(1)
    );
  }
}
