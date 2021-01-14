import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PhoneAuthSignInPage } from './phone-auth-sign-in.page';

const routes: Routes = [
  {
    path: '',
    component: PhoneAuthSignInPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PhoneAuthSignInPageRoutingModule {}
