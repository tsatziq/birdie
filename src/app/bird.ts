import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bird } from './types/bird';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BirdService {
  constructor(private http: HttpClient) {}

   getBirds(): Observable<Bird[]> {
    return this.http.get<Bird[]>('assets/birds.json');
  }
}
