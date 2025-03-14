import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MockAPIRequestService } from '../mock-api-request.service';
import { Observable, firstValueFrom } from 'rxjs';

interface Materiel {
  id: number;
  nom: string;
  description: string;
  serviceDat: string;
  endGarantee: string;
}

@Component({
  selector: 'app-materiels',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './materiels.component.html',
  styleUrls: ['./materiels.component.css'],
})
export class MaterielsComponent implements OnInit {
  materielForm: FormGroup;
  materiels$: Observable<Materiel[]>; // ✅ Utilisation d'un Observable pour écouter les modifications
  isEditMode = false;
  currentEditedId: number | null = null;

  private mockAPI = inject(MockAPIRequestService); // ✅ Injection propre en standalone

  constructor() {
    this.materielForm = new FormGroup({
      nom: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      serviceDat: new FormControl('', Validators.required),
      endGarantee: new FormControl('', Validators.required),
    });

    this.materiels$ = this.mockAPI.getMateriels();

    // ✅ Met à jour la validation du formulaire à chaque changement
    this.materielForm.valueChanges.subscribe(() => {
      this.materielForm.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.materiels$ = this.mockAPI.getMateriels(); // ✅ On récupère les matériels au chargement
  }

  /** ✅ Vérifie si le formulaire est valide */
  isValidForm(): boolean {
    const serviceDat = this.materielForm.get('serviceDat')?.value;
    const endGarantee = this.materielForm.get('endGarantee')?.value;

    if (!this.materielForm.valid || !serviceDat || !endGarantee) {
      return false;
    }

    return new Date(endGarantee) > new Date(serviceDat);
  }

  /** ✅ Ajoute un matériel via le service */
  onAdd() {
    if (this.isValidForm()) {
      const newMateriel: Materiel = {
        id: 0, // L'ID sera défini par le service
        nom: this.materielForm.get('nom')?.value ?? '',
        description: this.materielForm.get('description')?.value ?? '',
        serviceDat: this.materielForm.get('serviceDat')?.value ?? '',
        endGarantee: this.materielForm.get('endGarantee')?.value ?? '',
      };
      this.mockAPI.addMateriel(newMateriel);
      this.resetForm();
    }
  }

  /** ✅ Passe en mode édition et charge les données */
  onEdit(materiel: Materiel) {
    this.materielForm.setValue({
      nom: materiel.nom,
      description: materiel.description,
      serviceDat: materiel.serviceDat,
      endGarantee: materiel.endGarantee,
    });
    this.isEditMode = true;
    this.currentEditedId = materiel.id;
  }

  /** ✅ Met à jour un matériel via le service */
  onUpdate() {
    if (this.currentEditedId && this.isValidForm()) {
      const confirmUpdate = window.confirm(
        'Êtes-vous sûr de vouloir modifier ce matériel ?'
      );
      if (!confirmUpdate) return;

      const updatedMateriel: Materiel = {
        id: this.currentEditedId,
        nom: this.materielForm.get('nom')?.value ?? '',
        description: this.materielForm.get('description')?.value ?? '',
        serviceDat: this.materielForm.get('serviceDat')?.value ?? '',
        endGarantee: this.materielForm.get('endGarantee')?.value ?? '',
      };
      this.mockAPI.updateMateriel(updatedMateriel);
      this.resetForm();
    }
  }

  /** ✅ Supprime un matériel via le service */
  onDelete(id: number) {
    const confirmDelete = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce matériel ?'
    );
    if (!confirmDelete) return;

    this.mockAPI.deleteMateriel(id);
  }

  /** ✅ Réinitialise le formulaire et repasse en mode ajout */
  resetForm() {
    this.materielForm.reset();
    this.isEditMode = false;
    this.currentEditedId = null;
  }

  /** ✅ Soumission du formulaire */
  onSubmit() {
    if (this.isEditMode) {
      this.onUpdate();
    } else {
      this.onAdd();
    }
  }
}
