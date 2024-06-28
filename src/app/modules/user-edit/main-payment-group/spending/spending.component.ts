import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { PaymentTypeEnumLabelMapping } from 'src/app/core/enums/user/payment-type/payment-type-enum.model';
import { SalaryTypeLabelMapping } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { AmountTypeEnumLabelMapping, AmountTypeEnum } from 'src/app/core/enums/user/spending/amount-type-enum.model';
import { PaymentCategoryTypeEnumLabelMapping, PaymentCategoryTypeEnum } from 'src/app/core/enums/user/spending/payment-category-type-enum.model';
import { TaxTypeEnumLabelMapping, TaxTypeEnum } from 'src/app/core/enums/user/spending/tax-type-enum.model';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';
import { UserService } from 'src/app/core/services/users/users.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-spending',
  templateUrl: './spending.component.html',
  styleUrls: ['./spending.component.scss']
})
export class SpendingComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  paymentId: number;
  _startDate: Date = moment(new Date()).add(-30, 'day').toDate();
  _endDate: Date = new Date();
  clickedRowDescription: string;
  detailRow: any;

  constructor(
    private userPaymentService: UserPaymentService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    this._dataSource(this.userId, this._startDate, this._endDate);
  }
  
  //#region SalaryType
  SalaryTypeLabelMapping = SalaryTypeLabelMapping;
  //#endregion
  //#region SalaryType
  PaymentTypeLabelMapping = PaymentTypeEnumLabelMapping;
  //#endregion

  amountTypeLabelMapping = AmountTypeEnumLabelMapping;

  paymentCategoryTypeLabelMapping = PaymentCategoryTypeEnumLabelMapping;

  taxTypeLabelMapping = TaxTypeEnumLabelMapping;

  _dataSource(userId, startDate, endDate) {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userPaymentService.getUserSpendingPaymentWithDate(userId, startDate, endDate)),
    });
    this.cdr.detectChanges();
  }
  onRowClick(e) {
    this.detailRow = e.data;
    this.clickedRowDescription = e.data.description;
  }
  editPaymentClick(e, userPaymentEdit) {
    this.paymentId = e.data.id;
    this.modalService.open(userPaymentEdit, { size: 'lg' });
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
    this._dataSource(this.userId, this._startDate, this._endDate);
  }
  deletePaymentClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili ödeme bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userPaymentService.deleteUserPayment(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Ödeme Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource(this.userId, this._startDate, this._endDate);
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showPaymentModal(userPaymentCreate) {
    this.modalService.open(userPaymentCreate, { size: 'lg' });
  };

  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource(this.userId, this._startDate, this._endDate);
    }
  };

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}
