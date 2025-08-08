import { Component, EventEmitter, Output, OnInit  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepicker, MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { BirdService } from '../bird';
import { Bird } from '../types/bird';
import { BirdSighting } from '../types/bird-sighting';

@Component({
  selector: 'app-add-bird',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatCardModule,
    MatDatepicker,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './add-bird.html',
  styleUrl: './add-bird.css'
})

/**
 * Implements a small widget to add new bird sighting.
 *
 * Sighting details include name of the bird, date, and place of sighting.
 * @class
 */
export class AddBirdComponent implements OnInit {
  birdControl = new FormControl('');
  allBirds: Bird[] = [];
  suggestions$: Observable<Bird[]> = of([]);
  selectedDate: Date = new Date();
  place: string = '';

  @Output() birdSelected = new EventEmitter<BirdSighting>();

  constructor(private birdService: BirdService) {}

  ngOnInit() {
    this.birdService.getBirds().subscribe(birds => {
        this.allBirds = birds;

        this.suggestions$ = this.birdControl.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged(),
          map(value => this.filterBirds(value || ''))
        );
    });
  }

  /**
   * Sets the bird selected from matching suggestions.
   * @param {string} name The name of the bird selected.
   */
  onBirdSelected(name: string) {
    this.birdControl.setValue(name);
  }

  /**
   * Filters bird suggestions based on the user input.
   * @param {string} term User input string.
   * @returns {Bird[]} List of all matching birds.
   */
  private filterBirds(term: string): Bird[] {
    const lowerCaseTerm = term?.toLowerCase();
    return this.allBirds.filter(bird =>
      bird.commonName.toLowerCase().includes(lowerCaseTerm) ||
      bird.latinName.toLowerCase().includes(lowerCaseTerm)
    );
  }

  /**
   * Generates a unique ID for bird sighting based on the timestamp.
   *
   * TODO: search better alternative later. But this is sufficient for now.
   * @returns {Number} Unique timestamp based ID for the sighting.
   */
  private generateUniqueId() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const string = `${year}${month}${day}${hours}${minutes}${seconds}`;
    return parseInt(string, 10);
  }

  /**
   * Submits the bird sighting information.
   * @param {NgForm} f The form that contains the sighting information.
   */
  submitBird(f: NgForm) {
    const name = this.birdControl.value?.trim();
    if (!name || !this.selectedDate || !this.place.trim()) return;

    const sighting: BirdSighting = {
      id: this.generateUniqueId(),
      name,
      date: this.selectedDate.toISOString().split('T')[0],
      place: this.place.trim()
    };

    this.birdSelected.emit(sighting);

    // Reset form
    f.resetForm();
    this.birdControl.reset();
    this.place = '';
    this.selectedDate = new Date();
  }
}
