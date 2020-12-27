import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupSettingPage } from './group-setting.page';

const routes: Routes = [
  {
    path: '',
    component: GroupSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupSettingPageRoutingModule {}
