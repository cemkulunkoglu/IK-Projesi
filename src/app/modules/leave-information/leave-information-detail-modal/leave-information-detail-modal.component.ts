import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';
import { LeaveTypeEnumLabelMapping, LeaveTypeEnum } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { StatusTypeEnumLabelMapping, StatusTypeEnum } from 'src/app/core/enums/user/leave/status-type-enum.model';
import { UserService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-leave-information-detail-modal',
  templateUrl: './leave-information-detail-modal.component.html',
  styleUrls: ['./leave-information-detail-modal.component.scss']
})
export class LeaveInformationDetailModalComponent implements OnInit {
  @Output() userLeaveDetailModal = new EventEmitter<string>();
  @Input() leaveId: number;
  leaveInfo: any;
  leavePeriod: number;
  status: number;

  leaveTypeEnumLabelMapping = LeaveTypeEnumLabelMapping;
  leaveTypeEnum = Object.values(LeaveTypeEnum).filter(value => typeof value === 'number');

  statusTypeEnumLabelMapping = StatusTypeEnumLabelMapping;
  statusTypeEnum = Object.values(StatusTypeEnum).filter(value => typeof value === 'number');

  constructor(private userDemandService: UserDemandService, private userService: UserService) { }

  ngOnInit() {
    this.userDemandService.getUserLeaveById(this.leaveId).subscribe(res => {
      this.leaveInfo = res.data;
      this.status = this.leaveInfo.status;
      this.leavePeriod = res.data.leavePeriod;
      this.loadTemporaryUserName(this.leaveInfo.temporaryUserId);
    });
  }

  loadTemporaryUserName(userId: number) {
    if (userId) {
      this.userService.getUserDetail(userId).subscribe(res => {
        this.leaveInfo.temporaryUserName = res.data.name + ' ' + res.data.surname;
      });
    } else {
      this.leaveInfo.temporaryUserName = 'Yok';
    }
  }
}
