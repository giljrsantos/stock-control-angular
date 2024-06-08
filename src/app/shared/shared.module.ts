import {
  CommonModule,
  CurrencyPipe,
} from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogService } from 'primeng/dynamicdialog';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShortenPipe } from './pipe/shorten/shorten.pipe';
import { ToolbarModule } from 'primeng/toolbar';
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';

@NgModule({
  declarations: [ToolbarNavigationComponent, ShortenPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,

    // PrimeNg
    ToolbarModule,
    CardModule,
    ButtonModule,
  ],
  exports: [ToolbarNavigationComponent, ShortenPipe],
  providers: [DialogService, CurrencyPipe],
})
export class SharedModule {}
