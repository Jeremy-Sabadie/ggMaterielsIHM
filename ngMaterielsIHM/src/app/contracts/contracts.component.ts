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

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit {
  contractForm!: FormGroup;
  contracts$: Observable<Contract[]>;
  isEditMode = false;
  currentEditedId?: number;

  private contractService = inject(ContractService);

  currentEntreprise: Entreprise = {
    id: 1,
    name: 'Entreprise Démo',
    tel: '0123456789',
  };

  constructor() {
    this.contracts$ = this.contractService.getAll();
  }

  ngOnInit(): void {
    this.contractForm = new FormGroup({
      duration: new FormControl('', [Validators.required, Validators.min(1)]),
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
    });

    this.loadContracts();
  }

  loadContracts() {
    this.testGetAll();
    this.contracts$ = this.contractService.getAll();
  }

  isValidForm(): boolean {
    const start = this.contractForm.get('startDate')?.value;
    const end = this.contractForm.get('endDate')?.value;
    return this.contractForm.valid && new Date(end) > new Date(start);
  }

  onSubmit() {
    this.isEditMode ? this.onUpdate() : this.onAdd();
  }

  onAdd() {
    if (!this.isValidForm()) {
      Swal.fire('Formulaire invalide', 'Vérifiez les champs.', 'warning');
      return;
    }

    const newContract: Omit<Contract, 'id'> = {
      duration: this.contractForm.get('duration')?.value,
      startDate: this.contractForm.get('startDate')?.value,
      endDate: this.contractForm.get('endDate')?.value,
      type: this.contractForm.get('type')?.value,
      entreprise: this.currentEntreprise,
    };

    this.contractService.create(newContract).subscribe(() => {
      console.log(newContract);
      Swal.fire('Ajout réussi', 'Le contrat a été créé.', 'success');
      this.loadContracts();
      this.resetForm();
    });
  }

  onEdit(contract: Contract) {
    this.contractForm.setValue({
      duration: contract.duration,
      startDate: this.formatDate(contract.startDate),
      endDate: this.formatDate(contract.endDate),
      type: contract.type,
    });

    this.isEditMode = true;
    this.currentEditedId = contract.id;
  }

  onUpdate() {
    if (!this.currentEditedId || !this.isValidForm()) {
      Swal.fire('Formulaire invalide', 'Vérifiez les champs.', 'warning');
      return;
    }

    const updatedContract: Contract = {
      id: this.currentEditedId,
      duration: this.contractForm.get('duration')?.value,
      startDate: this.contractForm.get('startDate')?.value,
      endDate: this.contractForm.get('endDate')?.value,
      type: this.contractForm.get('type')?.value,
      entreprise: this.currentEntreprise,
    };

    this.contractService
      .update(this.currentEditedId, updatedContract)
      .subscribe(() => {
        Swal.fire(
          'Modification réussie',
          'Le contrat a été mis à jour.',
          'success'
        );
        this.loadContracts();
        this.resetForm();
      });
  }

  onDelete(id?: number) {
    if (!id) {
      Swal.fire('Erreur', 'ID manquant.', 'error');
      return;
    }

    this.contractService.delete(id).subscribe(() => {
      Swal.fire('Suppression réussie', 'Le contrat a été supprimé.', 'success');
      this.loadContracts();
    });
  }

  resetForm() {
    this.contractForm.reset();
    this.isEditMode = false;
    this.currentEditedId = undefined;
  }

  getButtonTooltip(): string {
    return this.isValidForm() ? '' : 'Remplissez correctement les champs.';
  }

  private formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toISOString().substring(0, 10);
  }
  testGetAll() {
  this.contractService.getAll().subscribe({
    next: (data) => {
      console.log('📦 Contrats récupérés :', data);
      alert(`✅ ${data.length} contrats récupérés. Voir console.`);
    },
    error: (err) => {
      console.error('❌ Erreur lors du getAll() :', err);
      alert('⛔ Erreur lors de la récupération des contrats.');
    }
  });
}}
