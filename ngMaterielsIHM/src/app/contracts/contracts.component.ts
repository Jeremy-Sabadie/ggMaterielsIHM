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

interface Contract {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

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

  private mockAPI = inject(MockAPIRequestService);

  constructor() {
    this.contractForm = new FormGroup({
      name: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
    });

    this.contracts$ = this.mockAPI.getContracts();

    // ✅ Met à jour la validation en temps réel
    this.contractForm.valueChanges.subscribe(() => {
      this.contractForm.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    this.contracts$ = this.mockAPI.getContracts();
  }

  /** ✅ Vérifie si le formulaire est valide */
  isValidForm(): boolean {
    const startDate = this.contractForm.get('start_date')?.value;
    const endDate = this.contractForm.get('end_date')?.value;

    if (!this.contractForm.valid || !startDate || !endDate) {
      return false;
    }

    return new Date(endDate) > new Date(startDate);
  }

  /** ✅ Vérifie si un champ a été modifié */
  async isModified(): Promise<boolean> {
    if (!this.isEditMode || !this.currentEditedId) return false;

    try {
      const contracts = await firstValueFrom(this.mockAPI.getContracts());
      const oldContract = contracts.find((c) => c.id === this.currentEditedId);
      if (!oldContract) {
        return false;
      }

      return Object.keys(this.contractForm.controls).some(
        (key) =>
          this.contractForm.get(key)?.value !==
          oldContract[key as keyof Contract]
      );
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats :', error);
      return false;
    }
  }

  /** ✅ Ajoute un contrat via le service */
  onAdd() {
    if (this.isValidForm()) {
      const newContract: Contract = {
        id: 0,
        name: this.contractForm.get('name')?.value ?? '',
        start_date: this.contractForm.get('start_date')?.value ?? '',
        end_date: this.contractForm.get('end_date')?.value ?? '',
      };
      this.mockAPI.addContract(newContract);
      this.resetForm();
    }
  }

  /** ✅ Passe en mode édition et charge les données */
  onEdit(contract: Contract) {
    this.contractForm.setValue({
      name: contract.name,
      start_date: contract.start_date,
      end_date: contract.end_date,
    });
    this.isEditMode = true;
    this.currentEditedId = contract.id;
  }

  /** ✅ Confirme et met à jour un contrat */
  async onUpdate() {
    if (
      this.currentEditedId &&
      this.isValidForm() &&
      (await this.isModified())
    ) {
      const confirmUpdate = window.confirm(
        'Êtes-vous sûr de vouloir modifier ce contrat ?'
      );
      if (!confirmUpdate) return;

      const updatedContract: Contract = {
        id: this.currentEditedId,
        name: this.contractForm.get('name')?.value ?? '',
        start_date: this.contractForm.get('start_date')?.value ?? '',
        end_date: this.contractForm.get('end_date')?.value ?? '',
      };
      this.mockAPI.updateContract(updatedContract);
      this.resetForm();
    }
  }

  /** ✅ Confirme et supprime un contrat */
  onDelete(id: number) {
    const confirmDelete = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce contrat ?'
    );
    if (!confirmDelete) return;

    this.mockAPI.deleteContract(id);
  }

  /** ✅ Réinitialise le formulaire et repasse en mode ajout */
  resetForm() {
    this.contractForm.reset();
    this.isEditMode = false;
    this.currentEditedId = null;
  }

  /** ✅ Message d'information pour le bouton désactivé */
  getButtonTooltip(): string {
    if (!this.isValidForm()) {
      return 'Veuillez remplir tous les champs et vérifier que la date de fin est postérieure à la date de début.';
    }
    return '';
  }

  /** ✅ Soumission du formulaire */
  async onSubmit() {
    if (this.isEditMode) {
      await this.onUpdate();
    } else {
      this.onAdd();
    }
  }
}
