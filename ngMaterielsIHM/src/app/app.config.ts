import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { MaterielsComponent } from './materiels/materiels.component';
import { ContractsComponent } from './contracts/contracts.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'materiels', component: MaterielsComponent },
  { path: 'contracts', component: ContractsComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
