import { Component, OnInit, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { Contract } from '../../app/models/Contract';
import { Entreprise } from '../../app/models/Entrprise';
import { ContractService } from '../services/contracts.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}
  contractForm!: FormGroup;
  contracts$: Observable<Contract[]> = new Observable<Contract[]>();
  isEditMode = false;
  currentEditedId?: number;
  editedContract?: Contract;
  searchId: number | null = null;

  private contractService = inject(ContractService);

  currentEntreprise: Entreprise = {
    id: 1,
    name: 'Entreprise Démo',
    tel: '0123456789',
  };

  ngOnInit(): void {
    this.contractForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      duration: new FormControl(
        { value: '', disabled: true },
        Validators.required
      ),
    });
    this.contractForm.get('startDate')?.valueChanges.subscribe(() => {
      this.updateDurationFromDates();
    });
    this.contractForm.get('endDate')?.valueChanges.subscribe(() => {
      this.updateDurationFromDates();
    });
    this.loadContracts();
  }
  private updateDurationFromDates(): void {
    const start = new Date(this.contractForm.get('startDate')?.value);
    const end = new Date(this.contractForm.get('endDate')?.value);

    if (start && end && end > start) {
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      this.contractForm.get('duration')?.setValue(months, { emitEvent: false });
    }
  }
  loadContracts(): void {
    this.contracts$ = this.contractService.getAll();
  }

  onSubmit(): void {
    this.isEditMode ? this.onUpdate() : this.onAdd();
  }

  hasDateCoherence(): boolean {
    const start = this.contractForm.get('startDate')?.value;
    const end = this.contractForm.get('endDate')?.value;
    return !!start && !!end && new Date(end) > new Date(start);
  }
  getButtonTooltip(): string {
    if (!this.isValidForm()) {
      return 'Veuillez remplir tous les champs et vous assurer que la date de fin est postérieure à la date de début.';
    }
    return '';
  }
  onAdd() {
    if (!this.contractForm.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs du formulaire.',
      });
      return;
    }

    if (!this.hasDateCoherence()) {
      Swal.fire({
        icon: 'error',
        title: 'Dates incohérentes',
        text: 'La date de fin doit être postérieure à la date de début.',
      });
      return;
    }

    const newContract: Omit<Contract, 'id'> = {
      duration: this.contractForm.get('duration')?.value,
      startDate: this.contractForm.get('startDate')?.value,
      endDate: this.contractForm.get('endDate')?.value,
      type: this.contractForm.get('type')?.value,
      entreprise: this.currentEntreprise,
    };

    this.contractService.create(newContract).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Contrat créé',
          text: 'Le contrat a été ajouté avec succès.',
        });
        this.loadContracts();
        this.resetForm();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur serveur',
          text: 'Impossible de créer le contrat. Veuillez réessayer.',
        });
      },
    });
  }

  onEdit(contract: Contract): void {
    this.editedContract = contract;
    this.currentEditedId = contract.id;
    this.isEditMode = true;

    this.contractForm.setValue({
      duration: contract.duration,
      startDate: this.formatDate(contract.startDate),
      endDate: this.formatDate(contract.endDate),
      type: contract.type,
    });
  }

  onUpdate(): void {
    if (
      !this.contractForm.valid ||
      !this.currentEditedId ||
      !this.editedContract
    ) {
      Swal.fire(
        'Erreur',
        'Formulaire invalide ou contrat introuvable.',
        'warning'
      );
      return;
    }

    if (!this.hasDateCoherence()) {
      Swal.fire(
        'Dates incohérentes',
        'La date de fin doit être postérieure à la date de début.',
        'error'
      );
      return;
    }

    if (!this.hasFormChanged(this.editedContract)) {
      Swal.fire('Aucune modification', 'Aucun champ n’a été modifié.', 'info');
      return;
    }

    const updatedContract: Contract = {
      id: this.currentEditedId,
      duration: this.contractForm.value.duration,
      startDate: this.contractForm.value.startDate,
      endDate: this.contractForm.value.endDate,
      type: this.contractForm.value.type,
      entreprise: this.currentEntreprise,
    };

    Swal.fire({
      title: 'Confirmer la mise à jour ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifier',
    }).then((res) => {
      if (res.isConfirmed) {
        this.contractService
          .update(this.currentEditedId!, updatedContract)
          .subscribe(() => {
            Swal.fire('Modifié', 'Le contrat a été mis à jour.', 'success');
            this.loadContracts();
            this.resetForm();
          });
      }
    });
  }

  resetForm(): void {
    this.contractForm.reset();
    this.isEditMode = false;
    this.currentEditedId = undefined;
    this.editedContract = undefined;
  }

  formatDate(date: string | Date): string {
    return new Date(date).toISOString().substring(0, 10);
  }

  hasFormChanged(contract: Contract): boolean {
    return (
      this.contractForm.get('duration')?.value !== contract.duration ||
      this.contractForm.get('type')?.value !== contract.type ||
      this.formatDate(this.contractForm.get('startDate')?.value) !==
        this.formatDate(contract.startDate) ||
      this.formatDate(this.contractForm.get('endDate')?.value) !==
        this.formatDate(contract.endDate)
    );
  }

  onDelete(id?: number): void {
    if (!id) {
      Swal.fire('Erreur', 'ID du contrat manquant.', 'error');
      return;
    }

    Swal.fire({
      title: 'Confirmer la suppression ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        this.contractService.delete(id).subscribe(() => {
          Swal.fire('Supprimé', 'Le contrat a été supprimé.', 'success');
          this.loadContracts();
        });
      }
    });
  }

  searchById(): void {
    if (!this.searchId) {
      Swal.fire('Référence manquante', 'Entrez un ID de contrat.', 'warning');
      return;
    }

    this.contractService.getById(this.searchId).subscribe({
      next: (contract) => {
        this.contracts$ = new Observable((observer) => {
          observer.next([contract]);
          observer.complete();
        });
      },
      error: () => {
        Swal.fire(
          'Introuvable',
          `Aucun contrat trouvé avec l’ID ${this.searchId}.`,
          'info'
        );
        this.contracts$ = new Observable((observer) => {
          observer.next([]);
          observer.complete();
        });
      },
    });
  }
  isValidForm(): boolean {
    return this.contractForm.valid && this.hasDateCoherence();
  }
}
