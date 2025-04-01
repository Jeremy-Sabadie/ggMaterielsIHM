import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/auth.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  imports: [CommonModule, ReactiveFormsModule], // ✅ Ajouté ici
  providers: [AuthService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('AuthService dispo ? ', this.authService);
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe(
      (user: any) => {
        this.loading = false;
        if (user) {
          this.errorMessage = '';
          this.router.navigate(['/contracts']);
        } else {
          this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
        }
      },
      (error: unknown) => {
        this.loading = false;
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
      }
    );
  }
}
