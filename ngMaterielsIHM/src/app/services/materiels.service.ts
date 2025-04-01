import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materiel } from '../../app/models/Materiel';

@Injectable({
  providedIn: 'root',
})
export class MaterielService {
  // 🔄 Nouvelle URL relative avec proxy prefix
  private baseUrl = '/api/materiels';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Materiel[]> {
    return this.http.get<Materiel[]>(this.baseUrl);
  }

  getById(id: number): Observable<Materiel> {
    return this.http.get<Materiel>(`${this.baseUrl}/${id}`);
  }

  create(materiel: Materiel): Observable<Materiel> {
    return this.http.post<Materiel>(this.baseUrl, materiel);
  }

  update(id: number, materiel: Materiel): Observable<Materiel> {
    return this.http.put<Materiel>(`${this.baseUrl}/${id}`, materiel);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
