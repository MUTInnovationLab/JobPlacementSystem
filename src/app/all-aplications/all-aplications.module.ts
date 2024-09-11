import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllAplicationsPageRoutingModule } from './all-aplications-routing.module';

import { AllAplicationsPage } from './all-aplications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllAplicationsPageRoutingModule
  ],
  declarations: [AllAplicationsPage]
})
export class AllAplicationsPageModule {}
