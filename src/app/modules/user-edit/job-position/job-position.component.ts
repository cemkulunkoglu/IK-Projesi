import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { WorkingMethodLabelMapping } from 'src/app/core/enums/user/job-position/working-method-enum.model.enum';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-job-position',
  templateUrl: './job-position.component.html'
})
export class JobPositionComponent implements OnInit {
  @Input() userId: number;
  @Output() newActiveTab = new EventEmitter<string>();

  dataSource: CustomStore;
  jobPositionId: number;

  //#region WorkingMethod
  WorkingMethodLabelMapping = WorkingMethodLabelMapping;
  //#endregion

  constructor(
    private userService: UserService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this._dataSource();
  }

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userService.getUserJobPositionByUserId(this.userId)),
    });
    this.cdr.detectChanges();
  }

  editJobPositionClick(e, userJobPositionEdit) {
    this.jobPositionId = e.data.id;
    this.modalService.open(userJobPositionEdit, { size: 'lg' });
  }

  deleteJobPositionClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili iş poziyonu silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userService.deleteUserJobPosition(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("İş Poziyonu Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showJobPositionModal(userJobPositionCreate) {
    this.modalService.open(userJobPositionCreate, { size: 'lg' });
  };

  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource();
    }
  };

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
