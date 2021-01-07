import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HighChartPageRoutingModule } from './high-chart-routing.module';

import { HighChartPage } from './high-chart.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HighChartPageRoutingModule,
    ComponentsModule
  ],
  declarations: [HighChartPage]
})
export class HighChartPageModule {}
