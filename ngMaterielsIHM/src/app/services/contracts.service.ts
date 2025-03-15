import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Contract {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private apiUrl = 'http://localhost:8080/contracts'; // 🔥 URL de ton API REST Spring Boot

  constructor(private http: HttpClient) {}

  /** ✅ Récupère la liste de tous les contrats */
  getContracts(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.apiUrl);
  }

  /** ✅ Récupère un contrat par son ID */
  getContractById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.apiUrl}/${id}`);
  }

  /** ✅ Ajoute un contrat */
  addContract(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl, contract);
  }

  /** ✅ Met à jour un contrat */
  updateContract(contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.apiUrl}/${contract.id}`, contract);
  }

  /** ✅ Supprime un contrat */
  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
