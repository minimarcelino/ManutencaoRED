import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRAComponent } from './cra.component';

const routes: Routes = [
  {
    path: '', 
    component: CRAComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraRoutingModule { }