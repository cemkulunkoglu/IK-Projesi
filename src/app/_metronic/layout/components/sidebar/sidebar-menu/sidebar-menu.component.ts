import { Component, OnInit } from '@angular/core';
import { AccessTypeEnum } from 'src/app/core/enums/user/access-type-enum.model';
import { AuthService, UserType } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  currentUser: UserType;

  hasApprovalProcessPermission: boolean;
  hasVisaDocumentProcessPermission: boolean;
  hasCompanyInfoPermission: boolean;
  hasEducationPermission: boolean;
  hasEmbezzlementCategoryPermission: boolean;
  hasDocumentTypePermission: boolean;
  hasLeaveTypePermission: boolean;
  hasOfficialHolidayPermission: boolean;
  hasEmployeeListPermission: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.setPermissions();
    this.currentUser = this.authService.currentUserValue;
  }

  setPermissions() {
    this.hasApprovalProcessPermission = this.authService.hasPermission('approval-process-list');
    this.hasVisaDocumentProcessPermission = this.authService.hasPermission('visa-process-list');
    this.hasCompanyInfoPermission = this.authService.hasPermission('company-list') ||
      this.authService.hasPermission('branch-office-list') ||
      this.authService.hasPermission('department-list') ||
      this.authService.hasPermission('job-title-list');
    this.hasEducationPermission = this.authService.hasPermission('education-list');
    this.hasEmbezzlementCategoryPermission = this.authService.hasPermission('user-embezzlement-category-list');
    this.hasDocumentTypePermission = this.authService.hasPermission('document-type-list');
    this.hasLeaveTypePermission = this.authService.hasPermission('user-leave-list');
    this.hasOfficialHolidayPermission = this.authService.hasPermission('official-holiday-list');
    this.hasEmployeeListPermission = this.authService.hasPermission('user-list');
  }

  isEmployee(): boolean {
    return this.currentUser?.accessType === AccessTypeEnum.Employee;
  }

  isManager(): boolean {
    return this.currentUser?.accessType === AccessTypeEnum.Manager;
  }

  isSystemAdministrator(): boolean {
    return this.currentUser?.accessType === AccessTypeEnum.SystemAdministrator;
  }

  canViewSettings(): boolean {
    return this.isSystemAdministrator() || this.isManager();
  }
}
