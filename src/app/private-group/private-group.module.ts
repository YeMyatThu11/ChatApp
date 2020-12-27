import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrivateGroupPageRoutingModule } from './private-group-routing.module';

import { PrivateGroupPage } from './private-group.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrivateGroupPageRoutingModule
  ],
  declarations: [PrivateGroupPage]
})
export class PrivateGroupPageModule {}
