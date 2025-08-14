import { Component, EventEmitter, Output, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule,
  FormGroupDirective } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged,
  startWith } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepicker,
  MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BirdService } from '../bird';
import { Bird } from '../types/bird';
import { BirdSighting } from '../types/bird-sighting';
import { AddSpeciesComponent } from '../add-species/add-species';

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
    MatButtonModule
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
  form: FormGroup;

  allBirds: Bird[] = [];
  suggestions$: Observable<Bird[]> = of([]);
  selectedDate: Date = new Date();
  showAddNewOption = false;

  @Output() birdSelected = new EventEmitter<BirdSighting>();

  constructor(
    private fb: FormBuilder,
    private birdService: BirdService,
    private dialog: MatDialog
  ) {
    const currentDate = new Date().toISOString().substring(0, 10);

    this.form = this.fb.group({
      name: this.birdControl,
      place: ['', [Validators.required]],
      date: [currentDate, [Validators.required]]
    });
  }

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
    const matches = this.allBirds.filter(bird =>
      bird.commonName.toLowerCase().includes(lowerCaseTerm) ||
      bird.latinName.toLowerCase().includes(lowerCaseTerm)
    );
    this.showAddNewOption = term.length > 0 && !this.allBirds.some(
      b => b.commonName.toLowerCase() === term);
    return matches;
  }

  /**
   * Opens the dialog to add new bird species.
   */
  openAddSpeciesDialog() {
    const dialogRef = this.dialog.open(AddSpeciesComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.birdControl.setValue(result.commonName);
        this.showAddNewOption = false;
         Object.keys(this.form.controls).forEach(key =>{
       this.form.controls[key].setErrors(null)
      });
      }
    });

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
   */
  submitBird(ngForm: FormGroupDirective) {
    if (this.form.valid) {
      const name = this.birdControl.value!.trim();

      const sighting: BirdSighting = {
        id: this.generateUniqueId(),
        name,
        date: this.selectedDate.toISOString().split('T')[0],
        place: this.form.value.place.trim()
      };

      this.birdSelected.emit(sighting);

      // Reset form
      this.form.reset({ date: new Date().toISOString().substring(0, 10) });
      Object.keys(this.form.controls).forEach(key =>{
       this.form.controls[key].setErrors(null)
      });
      this.form.patchValue({
        date: new Date().toISOString().substring(0, 10)
      });
    }
  }
}
