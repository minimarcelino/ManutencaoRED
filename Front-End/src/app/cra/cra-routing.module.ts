import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CRAComponent } from './cra.component';
import { ProcessoREDComponent } from './processo-red/processo-red.component';

const routes: Routes = [
  {
    path: '', 
    component: CRAComponent,
    children: [{
      path: 'processo-red',
      component: ProcessoREDComponent

    }]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CraRoutingModule { }