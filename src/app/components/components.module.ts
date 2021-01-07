import { NgModule } from "@angular/core";
import { StampComponent } from './stamp/stamp.component';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule(
{
declarations:[
StampComponent,
],
imports:
[
CommonModule,
IonicModule
],
exports:[
StampComponent,
]
})
export class ComponentsModule{}