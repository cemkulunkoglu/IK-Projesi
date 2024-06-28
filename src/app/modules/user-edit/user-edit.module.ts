import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DxBulletModule, DxButtonModule, DxDataGridModule, DxTemplateModule, DxToastModule } from 'devextreme-angular';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { NgxMatDateAdapter, NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChangeProfileImageComponent } from './change-profile-image/change-profile-image.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MainPaymentGroupComponent } from './main-payment-group/main-payment-group.component';
import { SpendingComponent } from './main-payment-group/spending/spending.component';
import { SpendingUpdateComponent } from './main-payment-group/spending/spending-update/spending-update.component';
import { CustomDateAdapter } from '../Request/date-helper';
import { OvertimeButtonComponent } from './main-payment-group/overtime-button/overtime-button.component';
import { OvertimeButtonUpdateComponent } from './main-payment-group/overtime-button/overtime-button-update/overtime-button-update.component';
import { AdditionalPaymentComponent } from './main-payment-group/additional-payment/additional-payment.component';
import { AdditionalPaymentCreateComponent } from './main-payment-group/additional-payment/additional-payment-create/additional-payment-create.component';
import { SpecialDeductionComponent } from './main-payment-group/special-deduction/special-deduction.component';
import { SpecialDeductionUpdateComponent } from './main-payment-group/special-deduction/special-deduction-update/special-deduction-update.component';
import { SpecialDeductionCreateComponent } from './main-payment-group/special-deduction/special-deduction-create/special-deduction-create.component';
import { EducationModule } from './education/education.module';
import { EmbezzlementModule } from './embezzlement/embezzlement.module';
import { JobPositionModule } from './job-position/job-position.module';
import { DocumentModule } from './document/document.module';
import { JobPositionButtonModule } from './job-position-button/job-position-button.module';
import { LeavesModule } from './leave/leave.module';
import { OtherInformationModule } from './other-information/other-information.module';
import { OvertimeModule } from './overtime/overtime.module';
import { PaymentModule } from './payment/payment.module';
import { PersonelInformationModule } from './personel-information/personel-information.module';
import { UpdateUserActiveModule } from './update-user-active/update-user-active.module';
import { SalaryModule } from './salary/salary.module';
import { UserInformationModule } from './user-information/user-information.module';
import { WorkingScheduleModule } from './working-schedule/working-schedule.module';

@NgModule({
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: "tr-TR" },
    { provide: NgxMatDateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: "{ useUtc: true }" }
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: UserEditComponent,
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
    MatCheckboxModule,
    EducationModule,
    EmbezzlementModule,
    JobPositionModule,
    DocumentModule,
    JobPositionButtonModule,
    LeavesModule,
    OtherInformationModule,
    OvertimeModule,
    PaymentModule,
    PersonelInformationModule,
    UpdateUserActiveModule,
    SalaryModule,
    UserInformationModule,
    WorkingScheduleModule
  ],
  declarations: [
    UserEditComponent,
    ChangeProfileImageComponent,
    ChangePasswordComponent,
    MainPaymentGroupComponent,
    SpendingComponent,
    SpendingUpdateComponent,
    OvertimeButtonComponent,
    OvertimeButtonUpdateComponent,
    AdditionalPaymentComponent,
    AdditionalPaymentCreateComponent,
    SpecialDeductionComponent,
    SpecialDeductionUpdateComponent,
    SpecialDeductionCreateComponent,
  ]
})
export class UserEditModule { }
