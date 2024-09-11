import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmploymentPagePageRoutingModule } from './employment-page-routing.module';

import { EmploymentPagePage } from './employment-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmploymentPagePageRoutingModule
  ],
  declarations: [EmploymentPagePage]
})
export class EmploymentPagePageModule {}
