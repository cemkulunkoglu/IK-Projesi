import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { CurrencyTypeLabelMapping } from 'src/app/core/enums/user/salary/currency-type-enum.model.enum';
import { PeriodLabelMapping } from 'src/app/core/enums/user/salary/period-enum.model.enum';
import { SalaryTypeLabelMapping } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { UserService } from 'src/app/core/services/users/users.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html'
})
export class SalaryComponent implements OnInit {
  @Input() userId: number;

  @Output() newActiveTab = new EventEmitter<string>();

  dataSource: CustomStore;
  salaryId: number;

  //#region SalaryType
  SalaryTypeLabelMapping = SalaryTypeLabelMapping;
  //#endregion

  //#region Period
  PeriodLabelMapping = PeriodLabelMapping;
  //#endregion

  //#region CurrencyType
  CurrencyTypeLabelMapping = CurrencyTypeLabelMapping;
  //#endregion

  constructor(private userService: UserService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this._dataSource();
  }

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userService.getUserSalaryByUserId(this.userId)),
    });
    this.cdr.detectChanges();
  }

  editSalaryClick(e, userSalaryEdit) {
    this.salaryId = e.data.id;
    this.modalService.open(userSalaryEdit, { size: 'lg' });
  }

  deleteSalaryClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili maaş bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userService.deleteUserSalary(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Maaş Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showSalaryModal(userSalaryCreate) {
    this.modalService.open(userSalaryCreate, { size: 'lg' });
  };

  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource();
    }
  };
}
