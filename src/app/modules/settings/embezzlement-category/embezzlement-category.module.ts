import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbezzlementCategoryComponent } from './embezzlement-category.component';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { DxDataGridModule, DxButtonModule, DxBulletModule, DxTemplateModule, DxToastModule } from 'devextreme-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        DxToastModule,
        DxDataGridModule,
        DxButtonModule,
        DxBulletModule,
        DxTemplateModule,
        MatExpansionModule,
        InlineSVGModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDividerModule,
        MatSlideToggleModule,
        MatIconModule,
        NgxMatDatetimePickerModule,
        MatDatepickerModule,
        MatNativeDateModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        NgxMatSelectSearchModule,
        MatButtonModule,
    RouterModule.forChild([
      {
        path : '',
        component: EmbezzlementCategoryComponent
      }
    ])
  ],
  declarations: [
    EmbezzlementCategoryComponent,
  ]
})
export class EmbezzlementCategoryModule { }
