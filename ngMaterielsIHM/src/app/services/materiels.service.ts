import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Materiel {
  id: number;
  name: string;
  description: string;
  serviceDat: string;
  endGarantee: string;
}

@Injectable({
  providedIn: 'root',
})
export class MaterielsService {
  private apiUrl = 'http://localhost:8080/materiels'; // 🔥 URL de ton API REST Spring Boot

  constructor(private http: HttpClient) {}

  /** ✅ Récupère la liste de tous les matériels */
  getMateriels(): Observable<Materiel[]> {
    return this.http.get<Materiel[]>(this.apiUrl);
  }

  /** ✅ Récupère un matériel par son ID */
  getMaterielById(id: number): Observable<Materiel> {
    return this.http.get<Materiel>(`${this.apiUrl}/${id}`);
  }

  /** ✅ Ajoute un matériel */
  addMateriel(materiel: Materiel): Observable<Materiel> {
    return this.http.post<Materiel>(this.apiUrl, materiel);
  }

  /** ✅ Met à jour un matériel */
  updateMateriel(materiel: Materiel): Observable<Materiel> {
    return this.http.put<Materiel>(`${this.apiUrl}/${materiel.id}`, materiel);
  }

  /** ✅ Supprime un matériel */
  deleteMateriel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
