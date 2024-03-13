import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ChartsModule } from '@carbon/charts-angular';
import {
  GridModule,
  HeaderModule,
  TableModule,
  ThemeModule,
  TilesModule
} from 'carbon-components-angular';

const COMPONENTS = [
  HeaderComponent,
];

const MODULES = [
  CommonModule,
  RouterModule,
  ThemeModule,
  HeaderModule,
  GridModule,
  TilesModule,
  ChartsModule,
  TableModule
];

@NgModule({
  declarations: [
    COMPONENTS,
  ],
  imports: [
    MODULES
  ],
  exports: [
    COMPONENTS,
    MODULES
  ],
})
export class SharedModule { }
