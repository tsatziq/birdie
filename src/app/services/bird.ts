import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Bird } from '../types/bird';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BirdService {
  private findUrl = "http://localhost:3000/find/";
  private addSpeciesUrl = "http://localhost:3000/species/";

  constructor(private http: HttpClient) {}

  /**
   * Searches all birds that match common or Latin name.
   * @param searchTerm Used in case insensitive regex search.
   * @returns List of matching birds.
   */
  findBirds(searchTerm: string): Observable<Bird[]> {
    return this.http.get<Bird[]>(
      `${this.findUrl}${encodeURIComponent(searchTerm)}`);
  }

  addSpecies(bird: { commonName: string; latinName: string}): Observable<Bird> {
    return this.http.post<Bird>(this.addSpeciesUrl, bird);
  }
}
