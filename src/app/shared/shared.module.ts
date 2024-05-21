import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ChartsModule } from '@carbon/charts-angular';
import {
  ButtonModule,
  CheckboxModule,
  DatePickerModule,
  DialogModule,
  DropdownModule,
  GridModule,
  HeaderModule,
  IconModule,
  InputModule,
  LoadingModule,
  ModalModule,
  NotificationModule,
  NumberModule,
  PaginationModule,
  PlaceholderModule,
  RadioModule,
  TableModule,
  ThemeModule,
  TilesModule,
} from 'carbon-components-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ExpenseFormComponent } from './components/form/expense-form/expense-form.component';
import { DeleteModalComponent } from './components/modal/delete-modal/delete-modal.component';
import { ExpenseFormModalComponent } from './components/modal/expense-form-modal/expense-form-modal.component';

const COMPONENTS = [
  HeaderComponent,
  ExpenseFormComponent,
  DeleteModalComponent,
  ExpenseFormModalComponent,
];

const MODULES = [
  CommonModule,
  RouterModule,
  HttpClientModule,
  ThemeModule,
  HeaderModule,
  GridModule,
  TilesModule,
  ChartsModule,
  TableModule,
  ButtonModule,
  DialogModule,
  CheckboxModule,
  IconModule,
  LoadingModule,
  ReactiveFormsModule,
  NotificationModule,
  ModalModule,
  PlaceholderModule,
  InputModule,
  NumberModule,
  DropdownModule,
  LoadingModule,
  DatePickerModule,
  PaginationModule,
  RadioModule,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [MODULES],
  exports: [COMPONENTS, MODULES],
})
export class SharedModule {}
