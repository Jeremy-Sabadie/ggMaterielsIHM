import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { MaterielsComponent } from './materiels/materiels.component';
import { ContractsComponent } from './contracts/contracts.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent }, // ✅ Redirige par défaut
  { path: 'materiels', component: MaterielsComponent },
  { path: 'contracts', component: ContractsComponent },
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
