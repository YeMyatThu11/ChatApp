import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PhoneAuthSignInPageRoutingModule } from './phone-auth-sign-in-routing.module';

import { PhoneAuthSignInPage } from './phone-auth-sign-in.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PhoneAuthSignInPageRoutingModule
  ],
  declarations: [PhoneAuthSignInPage]
})
export class PhoneAuthSignInPageModule {}
