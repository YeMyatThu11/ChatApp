import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PhoneAuthPageRoutingModule } from './phone-auth-routing.module';

import { PhoneAuthPage } from './phone-auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    PhoneAuthPageRoutingModule
  ],
  declarations: [PhoneAuthPage]
})
export class PhoneAuthPageModule {}
