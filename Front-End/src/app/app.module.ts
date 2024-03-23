import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MessageDialogComponent } from './utils/message-dialog/message-dialog.component';
import { SnackBarComponent } from './utils/snack-bar/snack-bar.component';
import { UsuarioModule } from './usuario-nao-autenticado/usuario.module';
import { PerfilComponent } from './perfil/perfil.component';
import { CRAComponent } from './niveis-acesso/cra/cra.component';
import { CSPComponent } from './niveis-acesso/csp/csp.component';
import { CoordenadorComponent } from './niveis-acesso/coordenador/coordenador.component';
import { AdministradorComponent } from './niveis-acesso/administrador/administrador.component';
import { ProfessorComponent } from './niveis-acesso/professor/professor.component';
import { CraModule } from './niveis-acesso/cra/cra.module';
import { CspModule } from './niveis-acesso/csp/csp.module';
import { ProfessorModule } from './niveis-acesso/professor/professor.module';
import { CoordenadorModule } from './niveis-acesso/coordenador/coordenador.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MessageDialogComponent,
    SnackBarComponent,
    CRAComponent,
    CSPComponent,
    CoordenadorComponent,
    AdministradorComponent,
    ProfessorComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    CspModule,
    CraModule,
    ProfessorModule,
    CoordenadorModule,
    UsuarioModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
