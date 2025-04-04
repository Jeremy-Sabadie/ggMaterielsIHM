import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Contract } from '../../app/models/Contract';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  // 🔄 Nouvelle URL relative avec proxy prefix
  private baseUrl = '/api/contracts';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.baseUrl);
  }

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}/${id}`);
  }

  create(contract: Omit<Contract, 'id'>): Observable<Contract> {
    return this.http.post<Contract>(this.baseUrl, contract);
  }

  update(id: number, contract: Contract): Observable<Contract> {
    if (id === undefined) {
      return throwError(() => new Error('ID manquant pour la mise à jour.'));
    }
    return this.http.put<Contract>(`${this.baseUrl}/${id}`, contract);
  }

  delete(id: number): Observable<void> {
    if (id === undefined) {
      return throwError(() => new Error('ID manquant pour la suppression.'));
    }
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
