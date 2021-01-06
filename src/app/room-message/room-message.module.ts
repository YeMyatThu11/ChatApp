import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RoomMessagePageRoutingModule } from './room-message-routing.module';

import { RoomMessagePage } from './room-message.page';
import { NgCircleProgressModule } from 'ng-circle-progress';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RoomMessagePageRoutingModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 40,
      outerStrokeWidth: 4,
      innerStrokeWidth: 2,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 1000,
      
    })
  ],
  declarations: [RoomMessagePage]
})
export class RoomMessagePageModule {}
