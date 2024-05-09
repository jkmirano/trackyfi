import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ChartsModule } from '@carbon/charts-angular';
import {
  ButtonModule,
  CheckboxModule,
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
  PlaceholderModule,
  TableModule,
  ThemeModule,
  TilesModule,
} from 'carbon-components-angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from './components/modal/modal.component';
import { ExpenseFormComponent } from './components/form/expense-form/expense-form.component';

const COMPONENTS = [HeaderComponent, ModalComponent, ExpenseFormComponent];

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
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [MODULES],
  exports: [COMPONENTS, MODULES],
})
export class SharedModule {}
