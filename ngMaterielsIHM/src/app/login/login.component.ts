import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    const { email, password } = this.loginForm.value;

    this.auth.login(email, password).subscribe((user) => {
      if (user) {
        Swal.fire('Connecté', `Bienvenue ${user.name} !`, 'success');
        this.router.navigate(['/materiels']); // ou la page que tu veux
      } else {
        Swal.fire('Erreur', 'Identifiants incorrects', 'error');
      }
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
