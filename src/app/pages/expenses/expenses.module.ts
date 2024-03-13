import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRoutingModule } from './expenses-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ExpensesPage } from './expenses.page';


@NgModule({
  declarations: [ ExpensesPage ],
  imports: [
    CommonModule,
    ExpensesRoutingModule,
    SharedModule
  ]
})
export class ExpensesModule { }
