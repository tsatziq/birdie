import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { AddBirdComponent } from '../add-bird/add-bird';
import { A } from '@angular/cdk/keycodes';

export interface BirdSighting {
  name: string;
  date: string;
  place: string;
}

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
export class BirdListComponent {
  displayedColumns: string[] = ['name', 'date', 'place'];
  dataSource: BirdSighting[] = [
    { name: 'Sparrow', date: '2025-08-01', place: 'Central Park' },
    { name: 'Robin', date: '2025-08-02', place: 'Highland Forest' },
    { name: 'Eagle', date: '2025-08-03', place: 'Mountain View' }
  ];

  addBird(name: string) {
    const newSighting = {
      name,
      date: new Date().toISOString().split('T')[0],
      place: 'Unknown'
    };
    this.dataSource = [...this.dataSource, newSighting];
  }
}
