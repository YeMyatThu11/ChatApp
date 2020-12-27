import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomMessagePageRoutingModule } from './room-message-routing.module';

import { RoomMessagePage } from './room-message.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomMessagePageRoutingModule
  ],
  declarations: [RoomMessagePage]
})
export class RoomMessagePageModule {}
