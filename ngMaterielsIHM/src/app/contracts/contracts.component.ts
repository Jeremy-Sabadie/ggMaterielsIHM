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

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
})
export class ContractsComponent implements OnInit {
  contractForm: FormGroup;
  contracts$: Observable<Contract[]>;
  isEditMode = false;
  currentEditedId: number | null = null;

  private contractsService = inject(ContractsService);

  constructor() {
    this.contractForm = new FormGroup({
      name: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
    });

    this.contracts$ = this.contractsService.getContracts();

    this.contractForm.valueChanges.subscribe(() => {
      this.contractForm.updateValueAndValidity();
    });
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

  onAdd() {
    if (this.isValidForm()) {
      const newContract: Contract = {
        id: 0,
        name: this.contractForm.get('name')?.value ?? '',
        start_date: this.contractForm.get('start_date')?.value ?? '',
        end_date: this.contractForm.get('end_date')?.value ?? '',
      };
      this.contractsService.addContract(newContract).subscribe(() => {
        this.contracts$ = this.contractsService.getContracts();
        this.resetForm();
      });
    }
  }

  onEdit(contract: Contract) {
    this.contractForm.setValue({
      name: contract.name,
      start_date: contract.start_date,
      end_date: contract.end_date,
    });
    this.isEditMode = true;
    this.currentEditedId = contract.id;
  }

  onUpdate() {
    if (this.currentEditedId && this.isValidForm()) {
      const updatedContract: Contract = {
        id: this.currentEditedId,
        name: this.contractForm.get('name')?.value ?? '',
        start_date: this.contractForm.get('start_date')?.value ?? '',
        end_date: this.contractForm.get('end_date')?.value ?? '',
      };
      this.contractsService.updateContract(updatedContract).subscribe(() => {
        this.contracts$ = this.contractsService.getContracts();
        this.resetForm();
      });
    }
  }

  onDelete(id: number) {
    const confirmDelete = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce contrat ?'
    );
    if (!confirmDelete) return;

    this.contractsService.deleteContract(id).subscribe(() => {
      this.contracts$ = this.contractsService.getContracts();
    });
  }

  resetForm() {
    this.contractForm.reset();
    this.isEditMode = false;
    this.currentEditedId = null;
  }

  getButtonTooltip(): string {
    if (!this.isValidForm()) {
      return 'Veuillez remplir tous les champs et vérifier que la date de fin est postérieure à la date de début.';
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
