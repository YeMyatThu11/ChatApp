import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SettingMenuModalPageRoutingModule } from './setting-menu-modal-routing.module';

import { SettingMenuModalPage } from './setting-menu-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SettingMenuModalPageRoutingModule
  ],
  declarations: [SettingMenuModalPage]
})
export class SettingMenuModalPageModule {}
