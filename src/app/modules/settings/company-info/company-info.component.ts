import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {
  activeTab: string = 'company';

  hasCompanyListPermission: boolean;
  hasBranchOfficeListPermission: boolean;
  hasDepartmentListPermission: boolean;
  hasJobTitlePermission: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.setPermissions();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  setPermissions() {
    this.hasCompanyListPermission = this.authService.hasPermission('company-list');
    this.hasBranchOfficeListPermission = this.authService.hasPermission('branch-office-list');
    this.hasDepartmentListPermission = this.authService.hasPermission('department-list');
    this.hasJobTitlePermission = this.authService.hasPermission('job-title-list');
  }
}
