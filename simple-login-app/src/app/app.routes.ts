import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { CashiersComponent } from './cashiers/cashiers';
import { AdminCustomersComponent } from './admin-customers/admin-customers';
import { PerimeterPatrol } from './perimeter-patrol';

export const networkPaths: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'cashiers', 
    component: CashiersComponent,
    canActivate: [PerimeterPatrol],
    data: { clearanceLevel: 'CASHIER' },
    runGuardsAndResolvers: 'always' 
  },
  { 
    path: 'admin-customers', 
    component: AdminCustomersComponent,
    canActivate: [PerimeterPatrol],
    data: { clearanceLevel: 'ADMIN' } ,
    runGuardsAndResolvers: 'always'
  },
  { 
    path: '', 
    redirectTo: '/login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: '/login' 
  }
];