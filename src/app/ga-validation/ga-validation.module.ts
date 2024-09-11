import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GaValidationPageRoutingModule } from './ga-validation-routing.module';

import { GaValidationPage } from './ga-validation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GaValidationPageRoutingModule
  ],
  declarations: [GaValidationPage]
})
export class GaValidationPageModule {}
