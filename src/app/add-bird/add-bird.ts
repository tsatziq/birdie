import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { BirdService } from '../bird';
import { Bird } from '../types/bird';

@Component({
  selector: 'app-add-bird',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule
  ],
  templateUrl: './add-bird.html',
  styleUrl: './add-bird.css'
})
export class AddBirdComponent {
  birdControl = new FormControl('');
  allBirds: Bird[] = [];
  suggestions: Bird[] = [];

  @Output() birdSelected = new EventEmitter<string>();

  constructor(private birdService: BirdService) {
    this.birdService.getBirds().subscribe(birds => {
        this.allBirds = birds;
    });

    this.birdControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe(value => {
        const term = value?.toLowerCase() || '';
        this.suggestions = this.allBirds.filter(b =>
          b.commonName.toLowerCase().includes(term) ||
          b.latinName.toLowerCase().includes(term)
        );
      });
  }

  onBirdSelected(birdName: string) {
    this.birdSelected.emit(birdName);
    this.birdControl.setValue('');
    this.suggestions = [];
  }
}
