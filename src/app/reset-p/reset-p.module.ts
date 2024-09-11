import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResetPPageRoutingModule } from './reset-p-routing.module';

import { ResetPPage } from './reset-p.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResetPPageRoutingModule
  ],
  declarations: [ResetPPage]
})
export class ResetPPageModule {}
