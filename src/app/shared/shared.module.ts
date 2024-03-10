import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GridModule, HeaderModule, ThemeModule, TilesModule } from 'carbon-components-angular';
import { HeaderComponent } from './components/header/header.component';
import { ChartsModule } from '@carbon/charts-angular';

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
  ChartsModule
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
