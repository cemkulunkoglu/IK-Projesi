import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { EducationModule } from '../user-edit/education/education.module';
import { EmbezzlementModule } from '../user-edit/embezzlement/embezzlement.module';
import { JobPositionModule } from '../user-edit/job-position/job-position.module';
import { DocumentModule } from '../user-edit/document/document.module';
import { JobPositionButtonModule } from '../user-edit/job-position-button/job-position-button.module';
import { LeavesModule } from '../user-edit/leave/leave.module';
import { OtherInformationModule } from '../user-edit/other-information/other-information.module';
import { OvertimeModule } from '../user-edit/overtime/overtime.module';
import { PaymentModule } from '../user-edit/payment/payment.module';
import { PersonelInformationModule } from '../user-edit/personel-information/personel-information.module';
import { SalaryModule } from '../user-edit/salary/salary.module';
import { UpdateUserActiveModule } from '../user-edit/update-user-active/update-user-active.module';
import { UserInformationModule } from '../user-edit/user-information/user-information.module';
import { WorkingScheduleModule } from '../user-edit/working-schedule/working-schedule.module';
import { UserEditModule } from '../user-edit/user-edit.module';


@NgModule({
  imports: [
    CommonModule,
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
    SalaryModule,
    UpdateUserActiveModule,
    UserInformationModule,
    WorkingScheduleModule,
    UserEditModule
  ]
})
export class UserProfileModule { }
