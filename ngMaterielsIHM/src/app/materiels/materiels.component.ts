import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Materiel } from '../../app/models/Materiel';
import { MaterielService } from '../services/materiels.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from '../../app/models/User';

@Component({
  selector: 'app-materiels',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './materiels.component.html',
  styleUrls: ['./materiels.component.css'],
})
export class MaterielsComponent implements OnInit {
  materielForm: FormGroup;
  materiels$: Observable<Materiel[]> = new Observable<Materiel[]>();
  isEditMode = false;
  currentEditedId: number | null = null;

  private materielsService = inject(MaterielService);

  currentUser: User = {
    id: 1,
    name: 'Utilisateur Démo',
    email: 'demo@example.com',
    password: 'demo',
    isAdmin: true,
  };

  constructor() {
    this.materielForm = new FormGroup({
      name: new FormControl('', Validators.required),
      endGarantee: new FormControl('', Validators.required),
      lastUpdate: new FormControl('', Validators.required),
      serviceDat: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.loadMateriels();
  }

  loadMateriels(): void {
    this.materiels$ = this.materielsService.getAll();
  }

  onSubmit() {
    this.isEditMode ? this.onUpdate() : this.onAdd();
  }

  onAdd() {
    if (!this.materielForm.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Tous les champs sont requis.',
      });
      return;
    }

    const raw = this.materielForm.value;

    const newMateriel: Materiel = {
      name: raw.name.trim(),
      endGarantee: new Date(raw.endGarantee + 'T00:00:00'),
      lastUpdate: new Date(raw.lastUpdate + 'T00:00:00'),
      serviceDat: new Date(raw.serviceDat + 'T00:00:00'),
      proprietaire: this.currentUser,
    };

    Swal.fire({
      icon: 'info',
      title: 'Données envoyées',
      html: `<pre style="text-align:left">${JSON.stringify(
        newMateriel,
        null,
        2
      )}</pre>`,
    });

    this.materielsService.create(newMateriel).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Créé !',
          text: 'Le matériel a été ajouté avec succès.',
          timer: 2000,
          showConfirmButton: false,
        });
        this.loadMateriels();
        this.resetForm();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur API',
          text: 'Impossible de créer le matériel. Consulte la console.',
          footer: `<code>${err.message}</code>`,
        });
        console.error('❌ Erreur API :', err);
      },
    });
  }

  onEdit(materiel: Materiel) {
    this.materielForm.setValue({
      name: materiel.name,
      endGarantee: this.formatDate(materiel.endGarantee),
      lastUpdate: this.formatDate(materiel.lastUpdate),
      serviceDat: this.formatDate(materiel.serviceDat),
    });
    this.isEditMode = true;
    this.currentEditedId = materiel.id || null;
  }

  onUpdate() {
    if (!this.currentEditedId || !this.materielForm.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Formulaire invalide',
        text: 'Remplis tous les champs correctement.',
      });
      return;
    }

    Swal.fire({
      title: 'Confirmer vous la mise à jour ?',
      text: 'Les données seront modifiées de façon permanente.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, mettre à jour',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        const raw = this.materielForm.value;

        const updatedMateriel: Materiel = {
          name: raw.name.trim(),
          endGarantee: new Date(raw.endGarantee + 'T00:00:00'),
          lastUpdate: new Date(raw.lastUpdate + 'T00:00:00'),
          serviceDat: new Date(raw.serviceDat + 'T00:00:00'),
          proprietaire: this.currentUser,
        };

        this.materielsService
          .update(this.currentEditedId!, updatedMateriel)
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Modifié !',
                text: 'Le matériel a été mis à jour.',
                timer: 2000,
                showConfirmButton: false,
              });
              this.loadMateriels();
              this.resetForm();
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Erreur mise à jour',
                text: 'Impossible de mettre à jour.',
                footer: `<code>${err.message}</code>`,
              });
              console.error('❌ Erreur update :', err);
            },
          });
      }
    });
  }

  onDelete(id: number) {
    Swal.fire({
      title: 'Supprimer ?',
      text: 'Cette action est définitive.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.materielsService.delete(id).subscribe(() => {
          Swal.fire({
            icon: 'success',
            title: 'Supprimé !',
            timer: 1500,
            showConfirmButton: false,
          });
          this.loadMateriels();
        });
      }
    });
  }

  resetForm() {
    this.materielForm.reset();
    this.isEditMode = false;
    this.currentEditedId = null;
  }

  private formatDate(date: Date | string): string {
    return new Date(date).toISOString().substring(0, 10);
  }
}
