import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccessTypeEnum } from 'src/app/core/enums/user/access-type-enum.model';
import { UserLeaveModel } from 'src/app/core/models/users/leave/user-leave-model';
import { AuthService, UserType } from 'src/app/core/services/auth/auth.service';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-dashboard-leave',
  templateUrl: './dashboard-leave.component.html',
  styleUrls: ['./dashboard-leave.component.scss']
})
export class DashboardLeaveComponent implements OnInit {
  userData: Array<UserLeaveModel>;
  @Output() dashboardLeave = new EventEmitter<number>();

  currentUser: UserType;

  hasListPermission: boolean;

  constructor(
    private userService: UserService,
    private userDemandService: UserDemandService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.setPermissions();
    this.functionOfApprovedUserLeave();
    this.currentUser = this.authService.currentUserValue;
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('user-leave-list');
  }

  functionOfApprovedUserLeave() {
    this.userDemandService.getApprovedUserLeave().subscribe(res => {
      this.userData = res;
      this.dashboardLeave.emit(res.length);
      this.cdr.detectChanges();
    });
  }

  leaveReload() {
    this.showSpinner();
    this.functionOfApprovedUserLeave();
    setTimeout(() => {
      this.hideSpinner();
    }, 1000);
  }

  showSpinner() {
    document.getElementById("reloadAprovedUserLeaveButton").innerHTML = `
      <div id="spinner" class="spinner">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    `;
  }

  hideSpinner() {
    document.getElementById("reloadAprovedUserLeaveButton").innerHTML = `
      <i class="fa-solid fa-arrows-rotate"></i>
    `;
  }

  isToday(startDate: any): boolean {
    const today = new Date();
    const date = new Date(startDate);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth()
    );
  }

  isTomorrow(startDate: any): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = new Date(startDate);
    return (
      date.getDate() === tomorrow.getDate() &&
      date.getMonth() === tomorrow.getMonth()
    );
  }

  isEmployee(): boolean {
    return this.currentUser?.accessType === AccessTypeEnum.Employee;
  }
}
