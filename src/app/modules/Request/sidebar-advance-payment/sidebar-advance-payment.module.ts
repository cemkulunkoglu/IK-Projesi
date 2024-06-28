import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarAdvancePaymentComponent } from './sidebar-advance-payment.component';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { DxToastModule, DxDataGridModule, DxButtonModule, DxBulletModule, DxTemplateModule } from 'devextreme-angular';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CustomDateAdapter } from '../date-helper';



@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: "{ useUtc: true }"},
    {provide: DateAdapter, useClass: CustomDateAdapter }
  ],
  declarations: [SidebarAdvancePaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: SidebarAdvancePaymentComponent,
      },
    ]),
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
    MatCheckboxModule
  ]
})
export class SidebarAdvancePaymentModule { }
