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
import { DisciplinasComponent } from './disciplinas/disciplinas.component';
import { PeeComponent } from './pee/pee.component';
import { RedComponent } from './red/red.component';
import { MessageDialogComponent } from './utils/message-dialog/message-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SnackBarComponent } from './utils/snack-bar/snack-bar.component';
import { CRAComponent } from './cra/cra.component';
import { CSPComponent } from './csp/csp.component';
import { CspModule } from './csp/csp.module';
import { CraModule } from './cra/cra.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DisciplinasComponent,
    PeeComponent,
    RedComponent,
    MessageDialogComponent,
    SnackBarComponent,
    CRAComponent,
    CSPComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,
    CspModule,
    CraModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
