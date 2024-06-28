import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { StatusTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/status-type-enum.model';
import { SpecialDeductionTypeLabelMapping } from 'src/app/core/enums/user/special-deduction/special-deduction-type-enum.model';
import { AmountTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/amount-type-enum.model';
import { SpecialDeductionService } from 'src/app/core/services/users/special-deduction.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-special-deduction',
  templateUrl: './special-deduction.component.html',
  styleUrls: ['./special-deduction.component.scss']
})
export class SpecialDeductionComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  specialDeductionId: number;
  _startDate: Date = moment(new Date()).add(-30, 'day').toDate();
  _endDate: Date = new Date();
  clickedRowDescription: string;
  detailRow: any;

  constructor(
    private specialDeductionService: SpecialDeductionService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    this._dataSource(this.userId);
  }

  SpecialDeductionTypeLabelMapping = SpecialDeductionTypeLabelMapping;

  AmountTypeEnumLabelMapping = AmountTypeEnumLabelMapping;

  StatusTypeEnumLabelMapping = StatusTypeEnumLabelMapping;

  _dataSource(userId) {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.specialDeductionService.getSpecialDeductionsByUserId(userId)),
    });
    this.cdr.detectChanges();
  }
  
  onRowClick(e) {
    console.log(e.data);
    this.detailRow = e.data;
    this.clickedRowDescription = e.data.description;
  }

  editPaymentClick(e, specialDeductionEdit) {
    this.specialDeductionId = e.data.id;
    this.modalService.open(specialDeductionEdit, { size: 'lg' });
  }

  onChangeStartDate(event) {
    this._startDate = event.value;
  }

  onChangeEndDate(event) {
    if (event.value != null) {
      this._endDate = event.value;
    }
  }
  deletePaymentClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili Özel Kesinti bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.specialDeductionService.deleteSpecialDeduction(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Özel Kesinti Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource(this.userId);
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showPaymentModal(specialDeductionCreate) {
    this.modalService.open(specialDeductionCreate, { size: 'lg' });
  };

  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource(this.userId);
    }
  };

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
