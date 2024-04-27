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
  GridModule,
  HeaderModule,
  IconModule,
  LoadingModule,
  NotificationModule,
  TableModule,
  ThemeModule,
  TilesModule,
} from 'carbon-components-angular';
import { ReactiveFormsModule } from '@angular/forms';

const COMPONENTS = [HeaderComponent];

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
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [MODULES],
  exports: [COMPONENTS, MODULES],
})
export class SharedModule {}
