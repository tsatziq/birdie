import { Component, EventEmitter, Output, OnInit  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
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
export class AddBirdComponent implements OnInit {
  birdControl = new FormControl('');
  allBirds: Bird[] = [];
  suggestions: Bird[] = [];
  selectedDate: Date = new Date();
  place: string = '';

  @Output() birdSelected = new EventEmitter<BirdSighting>();

  constructor(private birdService: BirdService) {}

  ngOnInit() {
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

  onBirdSelected(name: string) {
    this.birdControl.setValue(name);
  }

  submitBird(f: NgForm) {
    const name = this.birdControl.value?.trim();
    if (!name || !this.selectedDate || !this.place.trim()) return;

    const sighting: BirdSighting = {
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
    this.suggestions = [];

  }
}
