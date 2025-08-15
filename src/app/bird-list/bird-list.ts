import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AddBirdComponent } from '../add-bird/add-bird';
import { BirdSighting } from '../types/bird-sighting';
import { SightingService } from '../services/sighting';
import { NotificationService } from '../services/notification';

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

  constructor(
    private sightingService: SightingService,
    private cdRef: ChangeDetectorRef,
    private notification: NotificationService) {}

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
  addSighting(newSighting: BirdSighting) {
    this.sightingService.addSighting(newSighting).subscribe({
      next: newSighting => {
        this.dataSource = [...this.dataSource, newSighting];
        this.notification.showNote("New sighting added!");
      },
      error: err => {
        console.error("❌ Error adding new sighting: ", err);
        this.notification.showError(
          "Failed to add sighting. Please try again.");
      }
    });
  }

  deleteSighting(id: string) {
    this.sightingService.deleteSighting(id).subscribe({
      next: res => {
        this.dataSource = this.dataSource.filter(s => s.id !== id);
        this.cdRef.detectChanges();
        this.notification.showNote("Sighting deleted.");
      },
      error: err => {
        console.error("❌ Error deleting sighting: ", err);
        this.notification.showError(
          "Failed to delete sighting. Please try again");
      }
    });
  }
}
