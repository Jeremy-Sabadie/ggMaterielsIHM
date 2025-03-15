import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterielsService, Materiel } from '../services/materiels.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-materiels',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './materiels.component.html',
  styleUrls: ['./materiels.component.css'],
})
export class MaterielsComponent implements OnInit {
  materielForm: FormGroup;
  materiels$: Observable<Materiel[]>;
  isEditMode = false;
  currentEditedId: number | null = null;

  private materielsService = inject(MaterielsService);

  constructor() {
    this.materielForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      serviceDat: new FormControl('', Validators.required),
      endGarantee: new FormControl('', Validators.required),
    });

    this.materiels$ = this.materielsService.getMateriels();

    this.materielForm.valueChanges.subscribe(() => {
      this.materielForm.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.materiels$ = this.materielsService.getMateriels();
  }

  isValidForm(): boolean {
    const serviceDat = this.materielForm.get('serviceDat')?.value;
    const endGarantee = this.materielForm.get('endGarantee')?.value;

    if (!this.materielForm.valid || !serviceDat || !endGarantee) {
      return false;
    }

    return new Date(endGarantee) > new Date(serviceDat);
  }

  onAdd() {
    if (this.isValidForm()) {
      const newMateriel: Materiel = {
        id: 0,
        name: this.materielForm.get('name')?.value ?? '',
        description: this.materielForm.get('description')?.value ?? '',
        serviceDat: this.materielForm.get('serviceDat')?.value ?? '',
        endGarantee: this.materielForm.get('endGarantee')?.value ?? '',
      };
      this.materielsService.addMateriel(newMateriel).subscribe(() => {
        this.materiels$ = this.materielsService.getMateriels();
        this.resetForm();
      });
    }
  }

  onEdit(materiel: Materiel) {
    this.materielForm.setValue({
      name: materiel.name,
      description: materiel.description,
      serviceDat: materiel.serviceDat,
      endGarantee: materiel.endGarantee,
    });
    this.isEditMode = true;
    this.currentEditedId = materiel.id;
  }

  onUpdate() {
    if (this.currentEditedId && this.isValidForm()) {
      const updatedMateriel: Materiel = {
        id: this.currentEditedId,
        name: this.materielForm.get('name')?.value ?? '',
        description: this.materielForm.get('description')?.value ?? '',
        serviceDat: this.materielForm.get('serviceDat')?.value ?? '',
        endGarantee: this.materielForm.get('endGarantee')?.value ?? '',
      };
      this.materielsService.updateMateriel(updatedMateriel).subscribe(() => {
        this.materiels$ = this.materielsService.getMateriels();
        this.resetForm();
      });
    }
  }

  onDelete(id: number) {
    const confirmDelete = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce matériel ?'
    );
    if (!confirmDelete) return;

    this.materielsService.deleteMateriel(id).subscribe(() => {
      this.materiels$ = this.materielsService.getMateriels();
    });
  }

  resetForm() {
    this.materielForm.reset();
    this.isEditMode = false;
    this.currentEditedId = null;
  }

  getButtonTooltip(): string {
    if (!this.isValidForm()) {
      return 'Veuillez remplir tous les champs et vérifier que la date de fin de garantie est postérieure à la date de mise en service.';
    }
    return '';
  }

  onSubmit() {
    if (this.isEditMode) {
      this.onUpdate();
    } else {
      this.onAdd();
    }
  }
}
