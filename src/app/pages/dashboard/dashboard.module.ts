import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { UserBirthdayComponent } from './user-birthday/user-birthday.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardLeaveComponent } from './dashboard-leave/dashboard-leave.component';
import { AwaitingLeaveRequestComponent } from './awaiting-leave-request/awaiting-leave-request.component';
import { AwaitingPaymentRequestComponent } from './awaiting-payment-request/awaiting-payment-request.component';
import { UserDistributionChartComponent } from './user-distribution-chart/user-distribution-chart.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { LeaveInformationComponent } from './leave-information/leave-information.component';
import { OvertimePaymentRequestComponent } from './overtime-payment-request/overtime-payment-request.component';
import { SpendingPaymentRequestComponent } from './spending-payment-request/spending-payment-request.component';
import { VisaDocumentRequestComponent } from './visa-document-request/visa-document-request.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HolidayDayComponent } from './holiday-day/holiday-day.component';
import { EventCalendarComponent } from './event-calendar/event-calendar.component';

@NgModule({
  declarations: [
    DashboardComponent,
    UserBirthdayComponent,
    ProfileComponent,
    DashboardLeaveComponent,
    AwaitingLeaveRequestComponent,
    AwaitingPaymentRequestComponent,
    UserDistributionChartComponent,
    LeaveInformationComponent,
    OvertimePaymentRequestComponent,
    SpendingPaymentRequestComponent,
    VisaDocumentRequestComponent,
    HolidayDayComponent,
    EventCalendarComponent
  ],
  imports: [
    CommonModule,
    NgApexchartsModule,
    MatProgressBarModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
      },
    ])
  ],
})
export class DashboardModule { }
