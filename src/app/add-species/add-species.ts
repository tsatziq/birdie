import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef,
  MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormBuilder, ReactiveFormsModule,
  Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-species',
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-species.html',
  styleUrl: './add-species.css'
})
export class AddSpeciesComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddSpeciesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      this.form = this.fb.group({
    commonName: ['', Validators.required],
    latinName: ['', Validators.required]
  });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      console.log("Add species OK");
    }
  }
}
