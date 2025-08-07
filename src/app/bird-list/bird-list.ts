import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AddBirdComponent } from '../add-bird/add-bird';
import { BirdSighting } from '../types/bird-sighting';
import { SightingService } from '../services/sighting';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bird-list.html',
  styleUrls: ['./bird-list.css']
})

/**
 * Displays a list of bird sightings in a table.
 * @class
 */
export class BirdListComponent {
  displayedColumns: string[] = ['name', 'date', 'place'];
  dataSource: BirdSighting[] = [];

  constructor(private sightingService: SightingService,
    private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.sightingService.getSightings().subscribe((data) => {
        this.dataSource = data;
        this.cdRef.detectChanges();
        console.log("Get sightings returned: ", data);
    });
  }

  /**
   * Adds a new bird sighting to the table.
   * @param {BirdSighting} newSighting Information about the new sighting.
   */
  addBird(newSighting: BirdSighting) {
    this.dataSource = [...this.dataSource, newSighting];
    this.sightingService.addSighting(newSighting).subscribe(added => {
      console.log("Add sighting returned: ", added);
    });
  }
}
