import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderModule, ThemeModule } from 'carbon-components-angular';
import { HeaderComponent } from './components/header/header.component';

const COMPONENTS = [
  HeaderComponent,
];

const MODULES = [
  CommonModule,
  RouterModule,
  ThemeModule,
  HeaderModule
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
