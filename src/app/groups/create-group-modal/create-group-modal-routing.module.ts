import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateGroupModalPage } from './create-group-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CreateGroupModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateGroupModalPageRoutingModule {}
