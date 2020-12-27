import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoomMessagePage } from './room-message.page';

const routes: Routes = [
  {
    path: '',
    component: RoomMessagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoomMessagePageRoutingModule {}
