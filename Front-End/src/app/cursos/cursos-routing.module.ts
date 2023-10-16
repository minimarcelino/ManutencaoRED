import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursosComponent } from './cursos.component';
import { ListarComponent } from './listar/listar.component';


const routes: Routes = [
    {
      path: '', 
      component: CursosComponent,
      children: [
        { path: 'curso', component: CursosComponent},
        { path: 'listar', component: ListarComponent},
        /*{ path: 'about', component: AboutComponent},*/
        { path: '', redirectTo: '/curso', pathMatch: 'full'}
      ]
    }
  ];
  
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CursosRoutingModule { }