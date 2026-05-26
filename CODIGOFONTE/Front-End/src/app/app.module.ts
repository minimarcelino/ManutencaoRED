import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


/* 🔥 LOCALE (CORREÇÃO DO ERRO) */
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

/* Angular Material */
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';

/* Configs Material */
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

/* Routing */
import { AppRoutingModule } from './app-routing.module';

/* Components */
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MessageDialogComponent } from './utils/message-dialog/message-dialog.component';
import { SnackBarComponent } from './utils/snack-bar/snack-bar.component';
import { PerfilComponent } from './perfil/perfil.component';
import { CRAComponent } from './niveis-acesso/cra/cra.component';
import { CSPComponent } from './niveis-acesso/csp/csp.component';
import { CoordenadorComponent } from './niveis-acesso/coordenador/coordenador.component';
import { ProfessorComponent } from './niveis-acesso/professor/professor.component';
import { TrocarSenhaComponent } from './modulos/servidores/trocar-senha/trocar-senha.component';
import { SenhaComponent } from './perfil/alterar-senha/senha.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { VisualizarDisciplinasComponent } from './visualizar-disciplinas/visualizar-disciplinas.component';
import { AssociarDisciplinaComponent } from './pages/associar-disciplina/associar-disciplina.component';

/* Modules */
import { UsuarioModule } from './usuario-nao-autenticado/usuario.module';
import { CspModule } from './niveis-acesso/csp/csp.module';
import { ProfessorModule } from './niveis-acesso/professor/professor.module';
import { CoordenadorModule } from './niveis-acesso/coordenador/coordenador.module';
import { ManualComponent } from './pages/manual/manual.component';

/* 🔥 REGISTRA O LOCALE */
registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MessageDialogComponent,
    SnackBarComponent,
    CRAComponent,
    CSPComponent,
    CoordenadorComponent,
    ProfessorComponent,
    PerfilComponent,
    SenhaComponent,
    TrocarSenhaComponent,
    HomeComponent,
    HeaderComponent,
    VisualizarDisciplinasComponent,
    AssociarDisciplinaComponent,
    ManualComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    /* Angular Material */
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDialogModule,

    /* Feature Modules */
    UsuarioModule,
    CspModule,
    ProfessorModule,
    CoordenadorModule,
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },

    /* 🔥 DEFINE PT-BR COMO PADRÃO */
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }