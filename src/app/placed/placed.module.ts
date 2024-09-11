import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlacedPageRoutingModule } from './placed-routing.module';

import { PlacedPage } from './placed.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlacedPageRoutingModule
  ],
  declarations: [PlacedPage]
})
export class PlacedPageModule {}
