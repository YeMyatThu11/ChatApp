import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrivateGroupPage } from './private-group.page';

const routes: Routes = [
  {
    path: '',
    component: PrivateGroupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateGroupPageRoutingModule {}
