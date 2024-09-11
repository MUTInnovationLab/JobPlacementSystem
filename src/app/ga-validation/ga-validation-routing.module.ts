import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GaValidationPage } from './ga-validation.page';

const routes: Routes = [
  {
    path: '',
    component: GaValidationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GaValidationPageRoutingModule {}
