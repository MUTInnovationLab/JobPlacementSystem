import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WilPagePage } from './wil-page.page';

const routes: Routes = [
  {
    path: '',
    component: WilPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WilPagePageRoutingModule {}
