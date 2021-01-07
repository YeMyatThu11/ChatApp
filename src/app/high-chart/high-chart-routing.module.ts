import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HighChartPage } from './high-chart.page';

const routes: Routes = [
  {
    path: '',
    component: HighChartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HighChartPageRoutingModule {}
