import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { User } from './models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users'; // JSON Server URL

  constructor(private http: HttpClient) {}

  /**
   * Login : vérifie les credentials sur JSON Server
   */
  login(email: string, password: string): Observable<User | null> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`)
      .pipe(
        map((users) => {
          if (users.length > 0) {
            const user = users[0];
            localStorage.setItem('user', JSON.stringify(user));
            return user;
          } else {
            return null;
          }
        })
      );
  }

  /**
   * Déconnexion : nettoyage du stockage local
   */
  logout(): void {
    localStorage.removeItem('user');
  }

  /**
   * Récupère l'utilisateur actuellement connecté
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? (JSON.parse(userJson) as User) : null;
  }

  /**
   * Indique si un utilisateur est connecté
   */
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Indique si l'utilisateur connecté est admin
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.isAdmin === true;
  }
}
