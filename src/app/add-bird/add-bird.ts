import { Component, EventEmitter, Output, OnInit, ViewChild  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule,
  FormGroupDirective } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, debounceTime, distinctUntilChanged,
  startWith, switchMap, tap } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule,
  MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDatepicker,
  MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BirdService } from '../services/bird';
import { Bird } from '../types/bird';
import { BirdSighting } from '../types/bird-sighting';
import { AddSpeciesComponent } from '../add-species/add-species';
import { NotificationService } from "../services/notification";

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
  @ViewChild(MatAutocompleteTrigger) matAutocomplete!: MatAutocompleteTrigger;

  constructor(
    private fb: FormBuilder,
    private birdService: BirdService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) {
    const currentDate = new Date().toISOString().substring(0, 10);

    this.form = this.fb.group({
      name: this.birdControl,
      place: ['', [Validators.required]],
      date: [currentDate, [Validators.required]]
    });
  }

  ngOnInit() {
    this.suggestions$ = this.birdControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => {
        const term = value?.trim();
        if (!term) {
          this.showAddNewOption = false;
          return of([]);
        }
        return this.birdService.findBirds(term).pipe(
          tap(results => {
            this.showAddNewOption =
              !results.some(b => b.commonName.toLowerCase() === term) &&
              !results.some(b => b.latinName.toLowerCase() === term);
          })
        )
      })
    );
  }

  /**
   * Sets the bird selected from matching suggestions.
   * @param {string} name The name of the bird selected.
   */
  onBirdSelected(name: string) {
    this.birdControl.setValue(name);
  }

  /**
   * Opens the dialog to add new bird species.
   */
  openAddSpeciesDialog() {
    this.showAddNewOption = false;
        Object.keys(this.form.controls).forEach(key =>{
          this.form.controls[key].setErrors(null)
      });
    const dialogRef = this.dialog.open(AddSpeciesComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.birdService.addSpecies(result).subscribe({
          next: newSpecies => {
            this.birdControl.setValue(newSpecies.commonName);
            this.matAutocomplete.closePanel();
            this.notification.showNote("Bird species added!");
          },
          error: err => {
            console.error("❌ Error adding new species: ", err);
            this.notification.showError(
              "Failed to add new species. Please try again.");
          }
        });
      }
    });
  }

  /**
   * Submits the bird sighting information.
   */
  submitBird(ngForm: FormGroupDirective) {
    if (this.form.valid) {
      const name = this.birdControl.value!.trim();

      const sighting: BirdSighting = {
        name: name,
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
