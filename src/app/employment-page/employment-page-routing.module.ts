import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmploymentPagePage } from './employment-page.page';

const routes: Routes = [
  {
    path: '',
    component: EmploymentPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmploymentPagePageRoutingModule {}
