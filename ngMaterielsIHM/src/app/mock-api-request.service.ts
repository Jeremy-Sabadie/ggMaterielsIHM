import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root', // ✅ Permet au service d'être utilisé sans `app.module.ts`
})
export class MockAPIRequestService {
  private materiels = [
    {
      id: 1,
      nom: 'Ordinateur Dell',
      description: 'Laptop',
      serviceDat: '2024-01-01',
      endGarantee: '2026-01-01',
    },
    {
      id: 2,
      nom: 'Imprimante HP',
      description: 'Imprimante laser',
      serviceDat: '2023-07-15',
      endGarantee: '2025-07-15',
    },
  ];

  private materielsSubject = new BehaviorSubject(this.materiels);

  private contracts = [
    {
      id: 1,
      name: 'Contrat Support IT',
      start_date: '2024-01-01',
      end_date: '2026-01-01',
    },
    {
      id: 2,
      name: 'Contrat Maintenance',
      start_date: '2023-07-15',
      end_date: '2025-07-15',
    },
  ];

  private contractsSubject = new BehaviorSubject(this.contracts);

  constructor() {}

  // ✅ CRUD pour les Matériels
  getMateriels(): Observable<any[]> {
    return this.materielsSubject.asObservable();
  }

  addMateriel(materiel: any): void {
    materiel.id =
      this.materiels.length > 0
        ? Math.max(...this.materiels.map((m) => m.id)) + 1
        : 1;
    this.materiels.push(materiel);
    this.materielsSubject.next([...this.materiels]);
  }

  updateMateriel(updatedMateriel: any): void {
    this.materiels = this.materiels.map((m) =>
      m.id === updatedMateriel.id ? updatedMateriel : m
    );
    this.materielsSubject.next([...this.materiels]);
  }

  deleteMateriel(id: number): void {
    this.materiels = this.materiels.filter((m) => m.id !== id);
    this.materielsSubject.next([...this.materiels]);
  }

  // ✅ CRUD pour les Contrats

  addContract(contract: any): void {
    contract.id =
      this.contracts.length > 0
        ? Math.max(...this.contracts.map((c) => c.id)) + 1
        : 1;
    this.contracts.push(contract);
    this.contractsSubject.next([...this.contracts]);
  }

  updateContract(updatedContract: any): void {
    this.contracts = this.contracts.map((c) =>
      c.id === updatedContract.id ? updatedContract : c
    );
    this.contractsSubject.next([...this.contracts]);
  }

  deleteContract(id: number): void {
    this.contracts = this.contracts.filter((c) => c.id !== id);
    this.contractsSubject.next([...this.contracts]);
  }

  getContracts(): Observable<any[]> {
    return this.contractsSubject.asObservable();
  }
}
