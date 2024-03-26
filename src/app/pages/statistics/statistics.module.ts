import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticsRoutingModule } from './statistics-routing.module';
import { StatisticsPage } from './statistics.page';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [StatisticsPage],
  imports: [
    CommonModule,
    StatisticsRoutingModule,
    SharedModule
  ]
})
export class StatisticsModule { }
