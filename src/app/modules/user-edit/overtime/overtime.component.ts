import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { UserOvertimeService } from 'src/app/core/services/users/user-overtime.service';
import { UserService } from 'src/app/core/services/users/users.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-overtime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.scss']
})
export class OvertimeComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  overtimeId: number;

  constructor(private userService: UserService,
    private userOvertimeService: UserOvertimeService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this._dataSource();
  }

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userOvertimeService.getUserOvertimeByUserId(this.userId)),
    });
    this.cdr.detectChanges();
  }

  editOvertimeClick(e, userOvertimeEdit) {
    this.overtimeId = e.data.id;
    this.modalService.open(userOvertimeEdit, { size: 'lg' });
  }

  deleteOvertimeClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili mesai bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userOvertimeService.deleteUserOvertime(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Mesai Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showOvertimeModal(userOvertimeCreate) {
    this.modalService.open(userOvertimeCreate, { size: 'lg' });
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
