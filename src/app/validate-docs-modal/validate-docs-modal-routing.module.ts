import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateDocsModalPage } from './validate-docs-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateDocsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateDocsModalPageRoutingModule {}
