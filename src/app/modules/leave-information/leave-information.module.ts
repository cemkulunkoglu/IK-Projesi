import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaveInformationComponent } from './leave-information.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { DxDataGridModule, DxButtonModule, DxBulletModule, DxTemplateModule, DxToastModule } from 'devextreme-angular';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule, NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CustomDateAdapter } from '../Request/date-helper';
import { UpdateLeaveInformationComponent } from './update-leave-information/update-leave-information.component';
import { LeaveInformationDetailModalComponent } from './leave-information-detail-modal/leave-information-detail-modal.component';
import { JobPositionModule } from '../user-edit/job-position/job-position.module';
import { SalaryModule } from '../user-edit/salary/salary.module';



@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
    { provide: NgxMatDateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: "{ useUtc: true }" }
  ],
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
    JobPositionModule,
    SalaryModule,
    MatCheckboxModule,
    RouterModule.forChild([
      {
        path: '',
        component: LeaveInformationComponent
      }
    ])
  ],
  declarations: [LeaveInformationComponent, UpdateLeaveInformationComponent, LeaveInformationDetailModalComponent]
})
export class LeaveInformationModule { }
