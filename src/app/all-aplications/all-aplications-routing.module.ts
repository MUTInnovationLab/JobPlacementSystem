import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllAplicationsPage } from './all-aplications.page';

const routes: Routes = [
  {
    path: '',
    component: AllAplicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllAplicationsPageRoutingModule {}
