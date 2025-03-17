import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface Contract {
  id?: number;
  name: string;
  start_date: string;
  end_date: string;
}

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  private apiUrl = '/api/contracts'; // ✅ URL pour le GET
  private updateUrl = '/contracts/contract'; // ✅ URL correcte pour le PUT

  constructor(private http: HttpClient) {}

  /** ✅ Récupérer la liste des contrats et mapper les champs */
  getContracts(): Observable<Contract[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((data) =>
        data.map((contract) => ({
          id: contract.id,
          name: contract.type, // 🔄 Convertir `type` en `name`
          start_date: contract.startDate, // 🔄 Convertir `startDate` en `start_date`
          end_date: contract.endDate, // 🔄 Convertir `endDate` en `end_date`
        }))
      ),
      tap((data) => console.log('✅ Données récupérées :', data)),
      catchError(this.handleError)
    );
  }

  /** ✅ Ajouter un contrat */
  addContract(contract: Contract): Observable<Contract> {
    return this.http.post<Contract>(this.apiUrl, contract).pipe(
      tap(() => console.log('✅ Contrat ajouté :', contract)),
      catchError((error) => {
        if (error.status === 403) {
          return throwError(
            () =>
              new Error("🚫 Vous n'avez pas les droits pour créer un contrat.")
          );
        }
        return this.handleError(error);
      })
    );
  }

  /** ✅ Modifier un contrat */
  updateContract(contract: Contract): Observable<Contract> {
    const url = `/api/contracts/contract/${contract.id}`;

    const payload = {
      id: contract.id,
      type: contract.name, // 🔄 Conversion de "name" en "type" car c'est ce que Spring attend !
      duration: this.calculateDuration(contract.start_date, contract.end_date), // 🔥 Ajoute la durée comme en Postman
      startDate: contract.start_date, // 🔄 Conversion pour correspondre à Spring Boot
      endDate: contract.end_date,
    };

    return this.http
      .put<Contract>(url, payload, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        tap(() => console.log(`✅ Contrat mis à jour :`, payload)),
        catchError(this.handleError)
      );
  }

  // Ajoute une fonction pour calculer la durée
  private calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    ); // Différence en jours
  }
  /** ✅ Supprimer un contrat */
  deleteContract(id: number): Observable<void> {
    const url = `/api/contracts/contract/${id}`; // Assurez-vous que l'URL est correcte
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`✅ Contrat supprimé avec ID: ${id}`)),
      catchError(this.handleError)
    );
  }
  /** ❌ Gestion des erreurs */
  private handleError(error: HttpErrorResponse) {
    console.error('❌ Erreur API:', error);
    return throwError(
      () => new Error('Une erreur est survenue, veuillez réessayer.')
    );
  }
}
