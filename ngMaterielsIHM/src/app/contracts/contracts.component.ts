import { Component, OnInit, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContractsService, Contract } from '../services/contracts.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
  encapsulation: ViewEncapsulation.None, // 🔥 Force l'application des styles
})
export class ContractsComponent implements OnInit {
  contractForm: FormGroup;
  contracts$: Observable<Contract[]>;
  isEditMode = false;
  currentEditedId?: number; // <-- Optionnel

  private contractsService = inject(ContractsService);

  constructor() {
    this.contractForm = new FormGroup({
      name: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
    });

    this.contracts$ = this.contractsService.getContracts();
  }

  ngOnInit(): void {
    this.contracts$ = this.contractsService.getContracts();
  }

  isValidForm(): boolean {
    const startDate = this.contractForm.get('start_date')?.value;
    const endDate = this.contractForm.get('end_date')?.value;

    if (!this.contractForm.valid || !startDate || !endDate) {
      return false;
    }
    return new Date(endDate) > new Date(startDate);
  }

  /** ✅ Ajouter un contrat avec gestion avancée des erreurs */
  onAdd() {
    if (!this.isValidForm()) {
      Swal.fire(
        'Formulaire invalide',
        'Veuillez remplir correctement tous les champs.',
        'warning'
      );
      return;
    }

    const newContract: Omit<Contract, 'id'> = {
      name: this.contractForm.get('name')?.value ?? '',
      start_date: this.contractForm.get('start_date')?.value ?? '',
      end_date: this.contractForm.get('end_date')?.value ?? '',
    };

    this.contractsService.addContract(newContract).subscribe(
      () => {
        this.contracts$ = this.contractsService.getContracts();
        this.resetForm();
        Swal.fire(
          'Ajout réussi',
          'Le contrat a été ajouté avec succès.',
          'success'
        );
      },
      (error) => {
        let errorMessage = 'Une erreur inconnue est survenue.';
        if (error.status === 400) errorMessage = 'Données invalides.';
        else if (error.status === 401)
          errorMessage = "Vous n'avez pas l'autorisation.";
        else if (error.status === 403) errorMessage = 'Accès refusé.';
        else if (error.status === 500) errorMessage = 'Erreur serveur.';

        Swal.fire("Échec de l'ajout", errorMessage, 'error');
      }
    );
  }

  /** ✅ Modifier un contrat */
  onEdit(contract: Contract) {
    this.contractForm.setValue({
      name: contract.name,
      start_date: contract.start_date,
      end_date: contract.end_date,
    });
    this.isEditMode = true;
    this.currentEditedId = contract.id;
  }

  /** ✅ Confirmation et modification */
  onUpdate() {
    if (!this.currentEditedId || !this.isValidForm()) {
      Swal.fire(
        'Formulaire invalide',
        'Vérifiez les champs avant de modifier.',
        'warning'
      );
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous modifier ce contrat ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifier',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedContract: Contract = {
          id: this.currentEditedId,
          name: this.contractForm.get('name')?.value ?? '',
          start_date: this.contractForm.get('start_date')?.value ?? '',
          end_date: this.contractForm.get('end_date')?.value ?? '',
        };

        this.contractsService.updateContract(updatedContract).subscribe(
          () => {
            this.contracts$ = this.contractsService.getContracts();
            this.resetForm();
            Swal.fire(
              'Modification réussie',
              'Le contrat a été mis à jour.',
              'success'
            );
          },
          (error) => {
            let errorMessage = 'Une erreur inconnue est survenue.';
            if (error.status === 400) errorMessage = 'Données invalides.';
            else if (error.status === 401)
              errorMessage = "Vous n'avez pas l'autorisation.";
            else if (error.status === 403) errorMessage = 'Accès refusé.';
            else if (error.status === 500) errorMessage = 'Erreur serveur.';

            Swal.fire('Échec de la modification', errorMessage, 'error');
          }
        );
      }
    });
  }

  /** ✅ Suppression avec confirmation */
  onDelete(id?: number) {
    if (!id) {
      Swal.fire('Erreur', "L'ID du contrat est invalide.", 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous supprimer ce contrat ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contractsService.deleteContract(id).subscribe(
          () => {
            this.contracts$ = this.contractsService.getContracts();
            Swal.fire(
              'Suppression réussie',
              'Le contrat a été supprimé.',
              'success'
            );
          },
          () => Swal.fire('Erreur', 'Échec de la suppression.', 'error')
        );
      }
    });
  }

  resetForm() {
    this.contractForm.reset();
    this.isEditMode = false;
    this.currentEditedId = undefined;
  }

  getButtonTooltip(): string {
    return !this.isValidForm() ? 'Remplissez correctement les champs.' : '';
  }

  onSubmit() {
    this.isEditMode ? this.onUpdate() : this.onAdd();
  }
}
