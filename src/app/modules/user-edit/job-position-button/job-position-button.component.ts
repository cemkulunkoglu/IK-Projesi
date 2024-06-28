import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-job-position-button',
  templateUrl: './job-position-button.component.html',
  styleUrls: ['./job-position-button.component.scss']
})
export class JobPositionButtonComponent implements OnInit {
  @Input() userId: number;

  activeTab: string = 'jobPosition';

  isJobPositionVisible: boolean = false;
  isSalaryVisible: boolean = false;
  isWorkSchedulesVisible: boolean = false;

  hasJobPositionListPermission: boolean = false;
  hasSalaryPermission: boolean = false;
  hasWorkSchedulesPermission: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.checkPermissions();
  }

  showTab(tab: string) {
    this.activeTab = tab;
  }

  getContent(tab: string): string {
    switch (tab) {
      case 'jobPosition':
        return 'Pozisyonum';
      case 'salary':
        return 'Maaşlar';
      case 'workSchedules':
        return 'Çalışma Takvimi';
      default:
        return '';
    }
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  checkPermissions() {
    this.hasJobPositionListPermission = this.hasPermission('user-job-position-list');
    this.isJobPositionVisible = this.hasJobPositionListPermission;
    this.hasSalaryPermission = this.hasPermission('user-job-position-list');
    this.hasWorkSchedulesPermission = this.hasPermission('user-job-position-list');
  }
}
