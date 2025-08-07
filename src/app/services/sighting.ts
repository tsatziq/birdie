import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { BirdSighting } from "../types/bird-sighting";

@Injectable({
  providedIn: 'root'
})
export class SightingService {
  private apiUrl = "http://localhost:3000/sightings";

  constructor(private http: HttpClient) {}

  getSightings(): Observable<BirdSighting[]> {
    return this.http.get<BirdSighting[]>(this.apiUrl);
  }

  addSighting(sighting: BirdSighting): Observable<BirdSighting> {
    return this.http.post<BirdSighting>(this.apiUrl, sighting);
  }
}
