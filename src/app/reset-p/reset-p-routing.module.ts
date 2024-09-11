import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResetPPage } from './reset-p.page';

const routes: Routes = [
  {
    path: '',
    component: ResetPPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResetPPageRoutingModule {}
