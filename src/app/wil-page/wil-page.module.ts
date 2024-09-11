import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WilPagePageRoutingModule } from './wil-page-routing.module';

import { WilPagePage } from './wil-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WilPagePageRoutingModule
  ],
  declarations: [WilPagePage]
})
export class WilPagePageModule {}
