import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import moment from 'moment';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { LeaveTypeEnum, LeaveTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { StatusTypeEnum, StatusTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/status-type-enum.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';

@Component({
  selector: 'app-leave-information',
  templateUrl: './leave-information.component.html',
  styleUrls: ['./leave-information.component.scss']
})
export class LeaveInformationComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  leaveId: number;
  detailRow: any;
  clickedRowDescription: string;
  selectedTab: number = 3;
  _startDate: Date = moment(new Date()).add(-30, 'day').toDate();
  _endDate: Date = new Date();
  _tabNumber: number = 3;

  hasListPermission: boolean;
  hasUpdatePermission: boolean;

  constructor(
    private userDemandService: UserDemandService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  sendRequest(tabNumber: number): void {
    this._tabNumber = tabNumber;
    this.selectedTab = tabNumber;

    let startDate = this._startDate;
    let endDate = this._endDate;
    if (tabNumber === 1) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      startDate = today;
    }

    this._dataSource(tabNumber, startDate, endDate);
  }

  statusEnumValues = Object.keys(StatusTypeEnum)
    .filter(key => !isNaN(Number(StatusTypeEnum[key])))
    .map(key => ({ label: StatusTypeEnumLabelMapping[Number(StatusTypeEnum[key])], value: Number(StatusTypeEnum[key]) }));

  leaveTypesEnumValues = Object.keys(LeaveTypeEnum)
    .filter(key => !isNaN(Number(LeaveTypeEnum[key])))
    .map(key => ({ label: LeaveTypeEnumLabelMapping[Number(LeaveTypeEnum[key])], value: Number(LeaveTypeEnum[key]) }));

  //#region StatusType
  StatusTypeEnumLabelMapping = StatusTypeEnumLabelMapping;
  leaveTypeSources = Object.values(StatusTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  //#region leaveType
  LeaveTypeEnumLabelMapping = LeaveTypeEnumLabelMapping;
  //#endregion

  ngOnInit() {
    this.setPermissions();
    this._dataSource(3, this._startDate, this._endDate);
  }

  setPermissions() {
    this.hasListPermission = this.authService.hasPermission('user-leave-list');
    this.hasUpdatePermission = this.authService.hasPermission('update-user-leave');
  }

  _dataSource(tabNumber, startDate, endDate) {
    this._tabNumber = tabNumber;
    startDate = this.adjustForTimezone(startDate, 0, 0, 0, 0);
    endDate = this.adjustForTimezone(endDate, 23, 59, 59, 999);

    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userDemandService.getUserLeavesWithParam(tabNumber, startDate, endDate)),
    });
    this.cdr.detectChanges();
  }

  adjustForTimezone(date: Date, hours: number, minutes: number, seconds: number, milliseconds: number): Date {
    date.setHours(hours, minutes, seconds, milliseconds);
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  }

  showLeaveDetailClick(e, userLeaveDetailModal) {
    this.leaveId = e.data.id;
    this.openModal(e, userLeaveDetailModal);
  }

  onRowClick(e, userLeaveDetailModal) {
    console.log(e.data);
    this.detailRow = e.data;
    this.clickedRowDescription = e.data.description;
  }

  openModal(e, userLeaveDetailModal) {
    this.modalService.open(userLeaveDetailModal, { size: 'm' });
  }

  onChangeStartDate(event) {
    this._startDate = event.value;
  }

  onChangeEndDate(event) {
    if (event.value != null) {
      this._endDate = event.value;
      this.filter();
    }
  }

  filter() {
    this._dataSource(3, this._startDate, this._endDate);
  }

  dateForrmat(date) {
    const format = 'MM.dd.yyyy';
    const locale = 'en-US';
    return formatDate(date, format, locale);
  }

  reloadDataSource(e) {
    if (e === "true") {
      this.modalService.dismissAll();
      this._dataSource(2, this._startDate, this._endDate);
    }
  }

  editLeaveClick(e, userLeaveEdit) {
    this.leaveId = e.data.id;
    this.modalService.open(userLeaveEdit, { size: 'lg' });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }
}
