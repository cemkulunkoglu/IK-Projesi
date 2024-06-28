import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { LeaveTypeEnum, LeaveTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { StatusTypeEnum, StatusTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/status-type-enum.model';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-leaves',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeavesComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  leaveId: number;
  detailRow: any;
  clickedRowDescription: string;
  percentageOfBar: number;
  balanceLeave: number;
  totalLeave: number;
  futureLeave: any;
  annualLeave: any;
  selectedStatus: number;
  selectedLeaveType: number;
  selectedYear: number;

  yearValue = [2023, 2024];

  statusEnumValues = Object.keys(StatusTypeEnum)
    .filter(key => !isNaN(Number(StatusTypeEnum[key])))
    .map(key => ({ label: StatusTypeEnumLabelMapping[Number(StatusTypeEnum[key])], value: Number(StatusTypeEnum[key]) }));

  leaveTypesEnumValues = Object.keys(LeaveTypeEnum)
    .filter(key => !isNaN(Number(LeaveTypeEnum[key])))
    .map(key => ({ label: LeaveTypeEnumLabelMapping[Number(LeaveTypeEnum[key])], value: Number(LeaveTypeEnum[key]) }));

  getStatusBadgeClass(status: StatusTypeEnum): string {
    switch (status) {
      case StatusTypeEnum.Approved:
        return 'badge badge-success';
      case StatusTypeEnum.WaitingApproved:
        return 'badge badge-warning';
      case StatusTypeEnum.Cancelled:
        return 'badge badge-danger';
      default:
        return '';
    }
  }

  //#region StatusType
  StatusTypeEnumLabelMapping = StatusTypeEnumLabelMapping;
  leaveTypeSources = Object.values(StatusTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  //#region leaveType
  LeaveTypeEnumLabelMapping = LeaveTypeEnumLabelMapping;
  //#endregion

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private userDemandService: UserDemandService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  onStatusChange(val) {
    this._dataSource();
  }

  onLeaveTypeChange(val) {
    this._dataSource();
  }

  onYearChange(val) {
    this._dataSource();
  }

  ngOnInit() {
    this.functionOfLeave();
    this._dataSource();
  }

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userDemandService.getUserLeaveByUserId(this.userId, this.selectedYear, this.selectedStatus, this.selectedLeaveType)),
    });
    this.cdr.detectChanges();
  }

  editLeaveClick(e, userLeaveEdit) {
    this.leaveId = e.data.id;
    this.modalService.open(userLeaveEdit, { size: 'lg' });
  }

  functionOfLeave() {
    this.userDemandService.getUserLeaveBalance(this.userId).subscribe(res => {
      this.annualLeave = res.annualLeave;
      this.futureLeave = res.futureLeave;
      this.balanceLeave = res.balanceLeave;
      this.totalLeave = this.annualLeave + this.balanceLeave;
      this.percentageOfBar = (this.balanceLeave / this.totalLeave) * 100;
      this.userId = res.userId;
      this.cdr.detectChanges();
    });
  }

  deleteLeaveClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili izin bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userDemandService.deleteUserLeave(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("İzin Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showLeaveModal(userLeaveCreate) {
    this.modalService.open(userLeaveCreate, { size: 'lg' });
  }

  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource();
    }
  }

  onRowClick(e) {
    this.detailRow = e.data;
    this.clickedRowDescription = e.data.description;
  }

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
