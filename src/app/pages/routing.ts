import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'users',
    loadChildren: () =>
      import('../modules/users/users.module').then((m) => m.UsersModule)
  },
  {
    path: 'leave-information',
    loadChildren: () =>
      import('../modules/leave-information/leave-information.module').then((m) => m.LeaveInformationModule)
  },
  {
    path: 'spending-information',
    loadChildren: () =>
      import('../modules/spending-information/spending-information.module').then((m) => m.SpendingInformationModule)
  },
  {
    path: 'calendar',
    loadChildren: () =>
      import('../modules/calendar/calendar.module').then((m) => m.CalendarModule)
  },
  {
    path: 'user-create',
    loadChildren: () =>
      import('../modules/user-create/user-create.module').then((m) => m.UserCreateModule)
  },
  {
    path: 'user-edit/:id',
    loadChildren: () =>
      import('../modules/user-edit/user-edit.module').then((m) => m.UserEditModule)
  },
  {
    path: 'settings/company-info',
    loadChildren: () =>
      import('../modules/settings/company-info/company-info.module').then((m) => m.CompanyInfoModule)
  },
  {
    path: 'settings/approval-process',
    loadChildren: () =>
      import('../modules/settings/approval-process/approval-process.module').then((m) => m.ApprovalProcessModule)
  },
  {
    path: 'settings/visa-process',
    loadChildren: () =>
      import('../modules/settings/visa-process/visa-process.module').then((m) => m.VisaProcessModule)
  },
  {
    path: 'settings/embezzlement-category',
    loadChildren: () =>
      import('../modules/settings/embezzlement-category/embezzlement-category.module').then((m) => m.EmbezzlementCategoryModule)
  },
  {
    path: 'settings/educations',
    loadChildren: () =>
      import('../modules/settings/educations/educations.module').then((m) => m.EducationsModule)
  },
  {
    path: 'settings/official-holidays',
    loadChildren: () =>
      import('../modules/settings/official-holidays/official-holidays.module').then((m) => m.OfficialHolidaysModule)
  },
  {
    path: 'settings/document-type',
    loadChildren: () =>
      import('../modules/settings/document-type/document-type.module').then((m) => m.DocumentTypeModule)
  },
  {
    path: 'settings/leaving-job-reason-category',
    loadChildren: () =>
      import('../modules/settings/leaving-job-reason-category/leaving-job-reason-category.module').then((m) => m.LeavingJobReasonCategoryModule)
  },
  {
    path: 'settings/leave-type',
    loadChildren: () =>
      import('../modules/settings/leave-type/leave-type.module').then((m) => m.LeaveTypeModule)
  },
  {
    path: 'settings/system-settings',
    loadChildren: () =>
      import('../modules/settings/system-settings/system-settings.module').then((m) => m.SystemSettingsModule)
  },
  {
    path: 'sidebar-leave',
    loadChildren: () =>
      import('../modules/Request/sidebar-leave/sidebar-leave.module').then((m) => m.SidebarLeaveModule)
  },
  {
    path: 'sidebar-advance-payment',
    loadChildren: () =>
      import('../modules/Request/sidebar-advance-payment/sidebar-advance-payment.module').then((m) => m.SidebarAdvancePaymentModule)
  },
  {
    path: 'sidebar-spending-payment/:id',
    loadChildren: () =>
      import('../modules/Request/sidebar-spending-payment/sidebar-spending-payment.module').then((m) => m.SidebarSpendingPaymentModule)
  },
  {
    path: 'sidebar-overtime-payment/:id',
    loadChildren: () =>
      import('../modules/Request/sidebar-overtime-payment/sidebar-overtime-payment.module').then((m) => m.SidebarOvertimePaymentModule)
  },
  {
    path: 'sidebar-document-request',
    loadChildren: () =>
      import('../modules/Request/sidebar-document-request/sidebar-document-request.module').then((m) => m.SidebarDocumentRequestModule)
  },
  {
    path: 'user-request-panel',
    loadChildren: () =>
      import('../modules/user-request-panel/user-request-panel.module').then((m) => m.UserRequestPanelModule)
  },
  {
    path: 'leave-request-panel',
    loadChildren: () =>
      import('../modules/user-request-panel/leave-request-panel/leave-request-panel.module').then((m) => m.LeaveRequestPanelModule)
  },
  {
    path: 'advance-payment-request-panel',
    loadChildren: () =>
      import('../modules/user-request-panel/advance-payment-request-panel/advance-payment-request-panel.module').then((m) => m.AdvancePaymentRequestPanelModule)
  },
  {
    path: 'overtime-payment-request-panel',
    loadChildren: () =>
      import('../modules/user-request-panel/overtime-payment-request-panel/overtime-payment-request-panel.module').then((m) => m.OvertimePaymentRequestPanelModule)
  },
  {
    path: 'spending-payment-request-panel',
    loadChildren: () =>
      import('../modules/user-request-panel/spending-payment-request-panel/spending-payment-request-panel.module').then((m) => m.SpendingPaymentRequestPanelModule)
  },
  {
    path: 'visa-document-request-panel',
    loadChildren: () =>
      import('../modules/user-request-panel/visa-document-request-panel/visa-document-request-panel.module').then((m) => m.VisaDocumentRequestPanelModule)
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
