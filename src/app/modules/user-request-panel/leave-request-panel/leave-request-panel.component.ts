import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { LeaveTypeEnumLabelMapping, LeaveTypeEnum } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { StatusTypeEnumLabelMapping, StatusTypeEnum } from 'src/app/core/enums/user/leave/status-type-enum.model';
import { UserLeaveModel } from 'src/app/core/models/users/leave/user-leave-model';
import { UserDemandService } from 'src/app/core/services/users/user-demand.service';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-leave-request-panel',
  templateUrl: './leave-request-panel.component.html',
  styleUrls: ['./leave-request-panel.component.scss']
})
export class LeaveRequestPanelComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  leaveId: number;

  //#region StatusType
  StatusTypeEnumLabelMapping = StatusTypeEnumLabelMapping;
  leaveTypeSources = Object.values(StatusTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  //#region leaveType
  LeaveTypeEnumLabelMapping = LeaveTypeEnumLabelMapping;
  //#endregion

  constructor(private userService: UserService,
    private toastrService: ToastrService,
    private userDemandService:UserDemandService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this._dataSource();
  }

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userDemandService.getAwaitingApprovingUserLeave()),
    });
  }

  editLeaveClick(e, userLeaveEdit) {
    this.leaveId = e.data.id;
    this.modalService.open(userLeaveEdit, { size: 'lg' });
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
  };

  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource();
    }
  };
}
