import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from './auth.service'; // adapte le chemin si besoin
import Swal from 'sweetalert2';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None, // ✅ Désactive l'encapsulation Angular
})
export class AppComponent {
  constructor(private router: Router,private auth : AuthService) {
    console.log('📢 AppComponent chargé !');
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
  logout(): void {
  Swal.fire({
    title: 'Déconnexion',
    text: 'Voulez-vous vraiment vous déconnecter ?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Oui',
    cancelButtonText: 'Annuler',
  }).then((result) => {
    if (result.isConfirmed) {
      this.auth.logout(); // Nettoyage localStorage
      this.router.navigate(['/login']); // Redirection
    }
  });

}}
