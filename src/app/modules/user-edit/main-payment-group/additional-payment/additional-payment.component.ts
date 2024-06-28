import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { SalaryTypeLabelMapping } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { AdditionalTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/additional-type-enum.model';
import { AmountTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/amount-type-enum.model';
import { PaymentAdditionalTypeLabelMapping } from 'src/app/core/enums/user/spending/payment-additional-type-enum.model';
import { RecurrentPayTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/recurrent-pay-type-enum.model';
import { AdditionalPaymentService } from 'src/app/core/services/users/additional-payment.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-additional-payment',
  templateUrl: './additional-payment.component.html',
  styleUrls: ['./additional-payment.component.scss']
})
export class AdditionalPaymentComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  paymentId: number;

  constructor(
    private additionalPaymentService: AdditionalPaymentService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    this._dataSource();
  }

  //#region SalaryType
  SalaryTypeLabelMapping = SalaryTypeLabelMapping;
  //#endregion
  //#region SalaryType
  PaymentAdditionalTypeLabelMapping = PaymentAdditionalTypeLabelMapping;
  //#endregion

  AdditionalTypeLabelMapping = AdditionalTypeEnumLabelMapping;

  amountTypeLabelMapping = AmountTypeEnumLabelMapping;

  RecurrentPayTypeEnumLabelMapping = RecurrentPayTypeEnumLabelMapping;

  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.additionalPaymentService.getAdditionalPaymentsByUserId(this.userId)),
    });
    this.cdr.detectChanges();
  }

  editPaymentClick(e, userPaymentEdit) {
    this.paymentId = e.data.id;
    this.modalService.open(userPaymentEdit, { size: 'lg' });
  }

  deleteAdditionalPaymentClick(e) {
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
        this.additionalPaymentService.deleteAdditionalPayment(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Ödeme Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource();
          },
          err => {
            this.toastrService.error("Bir Hata Oluştu. Lütfen Tekrar Deneyiniz", "Hata");
          });
      }
    });
  }

  showPaymentModal(userAdditionalPaymentCreate) {
    this.modalService.open(userAdditionalPaymentCreate, { size: 'lg' });
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
