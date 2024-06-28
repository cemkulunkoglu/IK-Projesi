import { Component, OnInit } from '@angular/core';
import { AccessTypeEnum } from 'src/app/core/enums/user/access-type-enum.model';
import { AuthService, UserType } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  currentUser: UserType;
  _isAwaitingLeaveRequest: boolean = true;
  _isUserBirthday: boolean = true;
  _isAwaitingPaymentRequest: boolean = true;
  _isDashboardLeave: boolean = true;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
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

  isAwaitingLeaveRequest(e) {
    this._isAwaitingLeaveRequest = e > 0;
  }

  isUserBirthday(e) {
    this._isUserBirthday = e > 0;
  }

  isAwaitingPaymentRequest(e) {
    this._isAwaitingPaymentRequest = e > 0;
  }

  isDashboardLeave(e) {
    this._isDashboardLeave = e > 0;
  }
}
