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

  /**
   * Returns all bird sightings.
   * @returns List of all BirdSightings.
   */
  getSightings(): Observable<BirdSighting[]> {
    return this.http.get<BirdSighting[]>(this.apiUrl);
  }

  /**
   * Adds a new bird sighting.
   * @param sighting The sighting to be added.
   * @returns The added sighting.
   */
  addSighting(sighting: BirdSighting): Observable<BirdSighting> {
    return this.http.post<BirdSighting>(this.apiUrl, sighting);
  }

  /**
   * Deletes a sighting based on its ID.
   * @param id Unique ID of the sighting to delete.
   * @returns Status code.
   */
  deleteSighting(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
