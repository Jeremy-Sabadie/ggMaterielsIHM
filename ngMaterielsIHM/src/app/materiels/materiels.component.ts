import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Materiel } from '../../app/models/Materiel';
import { User } from '../../app/models/User';
import { MaterielService } from '../services/materiels.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materiels',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './materiels.component.html',
  styleUrls: ['./materiels.component.css'],
})
export class MaterielsComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}
  materielForm!: FormGroup;

  materiels$: Observable<Materiel[]> = new Observable();
  isEditMode = false;
  currentEditedId: number | null = null;
  editedMateriel?: Materiel;
  searchId: number | null = null;

  private materielsService = inject(MaterielService);

  currentUser: User = {
    id: 1,
    name: 'Utilisateur Démo',
    email: 'demo@example.com',
    password: 'demo',
    isAdmin: true,
  };

  ngOnInit(): void {
    this.materielForm = new FormGroup({
      name: new FormControl('', Validators.required),
      endGarantee: new FormControl('', Validators.required),
      lastUpdate: new FormControl({
        value: this.getTodayDate(),
        disabled: true,
      }),
      serviceDat: new FormControl(
        { value: this.getTodayDate(), disabled: false },
        Validators.required
      ),
    });

    this.loadMateriels();
  }
  getTodayDate(): string {
    return new Date().toISOString().substring(0, 10);
  }
  loadMateriels(): void {
    this.materiels$ = this.materielsService.getAll();
  }

  formatDate(date: string | Date): string {
    return new Date(date).toISOString().substring(0, 10);
  }

  hasDateCoherence(): boolean {
    const start = new Date(this.materielForm.get('serviceDat')?.value);
    const end = new Date(this.materielForm.get('endGarantee')?.value);
    return start < end;
  }

  isValidForm(): boolean {
    if (!this.materielForm.valid) return false;

    const start = this.materielForm.get('serviceDat')?.value;
    const end = this.materielForm.get('endGarantee')?.value;

    if (!start || !end) return false;

    return new Date(start) < new Date(end);
  }

  hasFormChanged(m: Materiel): boolean {
    return (
      this.materielForm.get('name')?.value !== m.name ||
      this.formatDate(this.materielForm.get('endGarantee')?.value) !==
        this.formatDate(m.endGarantee) ||
      this.formatDate(this.materielForm.get('lastUpdate')?.value) !==
        this.formatDate(m.lastUpdate) ||
      this.formatDate(this.materielForm.get('serviceDat')?.value) !==
        this.formatDate(m.serviceDat)
    );
  }

  getButtonTooltip(): string {
    if (!this.materielForm.valid) {
      return 'Veuillez remplir tous les champs.';
    }

    if (!this.hasDateCoherence()) {
      return 'La date de garantie doit être postérieure à la date de mise en service.';
    }

    if (
      this.isEditMode &&
      this.editedMateriel &&
      !this.hasFormChanged(this.editedMateriel)
    ) {
      return 'Aucune modification détectée.';
    }

    return '';
  }

  onSubmit(): void {
    this.isEditMode ? this.onUpdate() : this.onAdd();
  }

  onAdd(): void {
    if (!this.isValidForm()) {
      Swal.fire(
        'Erreur',
        'Veuillez vérifier les champs et les dates.',
        'warning'
      );
      return;
    }

    const newMateriel: Omit<Materiel, 'id'> = {
      name: this.materielForm.get('name')?.value,
      endGarantee: new Date(this.materielForm.get('endGarantee')?.value),
      lastUpdate: new Date(this.materielForm.get('lastUpdate')?.value),
      serviceDat: new Date(this.materielForm.get('serviceDat')?.value),
      proprietaire: this.currentUser,
    };

    console.log('📤 Données envoyées au backend :', newMateriel);

    this.materielsService.create(newMateriel).subscribe({
      next: () => {
        Swal.fire('Ajouté', 'Le matériel a été créé avec succès.', 'success');
        this.loadMateriels();
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Erreur API :', error);
        Swal.fire('Erreur', 'Échec de la création du matériel.', 'error');
      },
    });
  }

  onEdit(materiel: Materiel): void {
    this.materielForm.setValue({
      name: materiel.name,
      endGarantee: this.formatDate(materiel.endGarantee),
      lastUpdate: this.getTodayDate(),
      serviceDat: this.formatDate(materiel.serviceDat),
    });

    this.materielForm.get('serviceDat')?.disable();
    this.materielForm.get('lastUpdate')?.disable();
    this.isEditMode = true;
    this.currentEditedId = materiel.id!;
    this.editedMateriel = materiel;
  }

  onUpdate(): void {
    if (!this.isValidForm() || !this.currentEditedId || !this.editedMateriel) {
      Swal.fire('Erreur', 'Formulaire invalide.', 'warning');
      return;
    }

    if (!this.hasFormChanged(this.editedMateriel)) {
      Swal.fire('Info', 'Aucune modification détectée.', 'info');
      return;
    }

    const rawForm = this.materielForm.getRawValue();

    const updated: Materiel = {
      id: this.currentEditedId!,
      name: rawForm.name,
      endGarantee: new Date(rawForm.endGarantee),
      lastUpdate: new Date(rawForm.lastUpdate),
      serviceDat: new Date(rawForm.serviceDat),
      proprietaire: this.currentUser,
    };

    Swal.fire({
      title: 'Confirmer la modification ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifier',
    }).then((res) => {
      if (res.isConfirmed) {
        this.materielsService
          .update(this.currentEditedId!, updated)
          .subscribe(() => {
            Swal.fire('Modifié', 'Le matériel a été mis à jour.', 'success');
            this.loadMateriels();
            this.resetForm();
          });
      }
    });
  }

  onDelete(id: number): void {
    Swal.fire({
      title: 'Supprimer ce matériel ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
    }).then((res) => {
      if (res.isConfirmed) {
        this.materielsService.delete(id).subscribe(() => {
          Swal.fire('Supprimé', 'Le matériel a été supprimé.', 'success');
          this.loadMateriels();
        });
      }
    });
  }

  resetForm() {
    this.materielForm.reset();

    // Remettre la date du jour en création
    this.materielForm.get('serviceDat')?.setValue(this.getTodayDate());

    // Réactiver le champ
    this.materielForm.get('serviceDat')?.enable();

    this.isEditMode = false;
    this.currentEditedId = null;
    this.editedMateriel = undefined;
  }

  searchById(): void {
    if (!this.searchId) {
      Swal.fire(
        'Attention',
        'Veuillez entrer le numéro de référence.',
        'warning'
      );
      return;
    }

    this.materielsService.getById(this.searchId).subscribe({
      next: (materiel) => {
        this.materiels$ = new Observable((obs) => {
          obs.next([materiel]);
          obs.complete();
        });
      },
      error: () => {
        Swal.fire('Introuvable', 'Aucun matériel trouvé.', 'info');
        this.materiels$ = new Observable((obs) => {
          obs.next([]);
          obs.complete();
        });
      },
    });
  }
  logout(): void {
    localStorage.removeItem('user');
  }
}
