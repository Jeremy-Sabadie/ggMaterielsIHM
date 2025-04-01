import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contract } from './models/Contract';


@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private baseUrl = 'http://85.215.130.154:3000/contracts';
  constructor(private http: HttpClient) {}

  getAll(): Observable<Contract[]> {
    return this.http.get<Contract[]>(this.baseUrl);
  }

  getById(id: number): Observable<Contract> {
    return this.http.get<Contract>(`${this.baseUrl}/${id}`);
  }

  create(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.baseUrl, contract);
  }

  update(id: number, contract: Contract): Observable<Contract> {
    return this.http.put<Contract>(`${this.baseUrl}/${id}`, contract);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
