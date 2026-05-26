import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

// NgxMask
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

// Routing
import { AdministradorRoutingModule } from './admin-routing.module';

// COMPONENTES DO ADMIN
import { AdministradorComponent } from './administrador.component';
import { HomeAdministradorComponent } from './home/home-administrador.component';

@NgModule({
  declarations: [
    AdministradorComponent,
    HomeAdministradorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AdministradorRoutingModule,

    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,

    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    provideNgxMask(),
  ],
})
export class AdministradorModule { }