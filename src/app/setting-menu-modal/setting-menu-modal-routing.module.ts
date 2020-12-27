import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingMenuModalPage } from './setting-menu-modal.page';

const routes: Routes = [
  {
    path: '',
    component: SettingMenuModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingMenuModalPageRoutingModule {}
