import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MessageDialogComponent } from './utils/message-dialog/message-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { SnackBarComponent } from './utils/snack-bar/snack-bar.component';
import { CRAComponent } from './cra/cra.component';
import { CSPComponent } from './csp/csp.component';
import { CspModule } from './csp/csp.module';
import { CraModule } from './cra/cra.module';
import { CoordenadorComponent } from './coordenador/coordenador.component';
import { CoordenadorModule } from './coordenador/coordenador.module';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { AdministradorComponent } from './administrador/administrador.component';
import { ProfessorComponent } from './professor/professor.component';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
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
    CoordenadorModule 
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
