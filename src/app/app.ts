import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BirdListComponent } from './bird-list/bird-list';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    BirdListComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('birdie');
}
