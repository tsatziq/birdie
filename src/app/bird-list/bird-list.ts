import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AddBirdComponent } from '../add-bird/add-bird';
import { BirdSighting } from '../types/bird-sighting';

@Component({
  selector: 'app-bird-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatToolbarModule,
    MatCardModule,
    AddBirdComponent
  ],
  templateUrl: './bird-list.html',
  styleUrls: ['./bird-list.css']
})

/**
 * Displays a list of bird sightings in a table.
 * @class
 */
export class BirdListComponent {
  displayedColumns: string[] = ['name', 'date', 'place'];
  dataSource: BirdSighting[] = [
    { name: 'Sparrow', date: '2025-08-01', place: 'Central Park' },
    { name: 'Robin', date: '2025-08-02', place: 'Highland Forest' },
    { name: 'Eagle', date: '2025-08-03', place: 'Mountain View' }
  ];

  /**
   * Adds a new bird sighting to the table.
   * @param {BirdSighting} newSighting Information about the new sighting.
   */
  addBird(newSighting: BirdSighting) {
    this.dataSource = [...this.dataSource, newSighting];
  }
}
