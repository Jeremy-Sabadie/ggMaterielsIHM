import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-materiel-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './materiel-dialog.component.html',
  styleUrls: ['./materiel-dialog.component.css'],
})
export class MaterielDialogComponent {
  materielForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<MaterielDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.materielForm = new FormGroup({
      name: new FormControl(data?.name || '', [
        Validators.required,
        Validators.maxLength(50),
      ]),
      serviceDat: new FormControl(
        data?.serviceDat || null,
        Validators.required
      ),
      endGarantee: new FormControl(data?.endGarantee || null),
      proprietaireId: new FormControl(data?.proprietaireId || null),
    });
  }

  save() {
    if (this.materielForm.valid) {
      this.dialogRef.close(this.materielForm.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
