import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateGroupModalPageRoutingModule } from './create-group-modal-routing.module';

import { CreateGroupModalPage } from './create-group-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateGroupModalPageRoutingModule
  ],
  declarations: [CreateGroupModalPage]
})
export class CreateGroupModalPageModule {}
