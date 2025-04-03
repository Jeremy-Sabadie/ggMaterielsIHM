import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';
import { User } from '../models/User';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class SignupComponent {
  signupForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(private auth: AuthService, private router: Router) {}

  onSignup(): void {
    if (this.signupForm.invalid) {
      Swal.fire(
        'Erreur',
        'Veuillez remplir tous les champs correctement.',
        'error'
      );
      return;
    }

    const newUser: User = {
      id: 0, // JSON Server attribuera un id automatiquement
      name: this.signupForm.get('name')?.value!,
      email: this.signupForm.get('email')?.value!,
      password: this.signupForm.get('password')?.value!,
      isAdmin: false, // Par défaut non admin
    };

    this.auth.signup(newUser).subscribe({
      next: () => {
        Swal.fire('Compte créé', 'Connectez-vous maintenant.', 'success');
        this.router.navigate(['/login']); // 🔁 Redirection ici
      },
      error: () => {
        Swal.fire('Erreur', 'Impossible de créer le compte.', 'error');
      },
    });
  }
}
