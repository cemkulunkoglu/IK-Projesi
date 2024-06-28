import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { PaymentTypeEnumLabelMapping } from 'src/app/core/enums/user/payment-type/payment-type-enum.model';
import { SalaryTypeLabelMapping } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-overtime-payment-request-panel',
  templateUrl: './overtime-payment-request-panel.component.html',
  styleUrls: ['./overtime-payment-request-panel.component.scss']
})
export class OvertimePaymentRequestPanelComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  paymentId: number;

  constructor(
    private userPaymentService: UserPaymentService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal) {
  }

  ngOnInit() {
    this._dataSource();
  }
  //#region SalaryType
  SalaryTypeLabelMapping = SalaryTypeLabelMapping;
  //#endregion
  //#region SalaryType
  PaymentTypeLabelMapping = PaymentTypeEnumLabelMapping;
  //#endregion
  _dataSource() {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userPaymentService.getUserOvertimePayments()),
    });
  }

  editPaymentClick(e, userPaymentEdit) {
    this.paymentId = e.data.id;
    this.modalService.open(userPaymentEdit, { size: 'lg' });
  }

  deletePaymentClick(e) {
    swal({
      title: "Silmek İstediğinize Emin misiniz?",
      text: "Seçili eğitimi bilgisi silinecek!",
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evet, Sil',
      cancelButtonText: 'Hayır',
    }).then((willDelete) => {
      if (willDelete.value) {
        this.userPaymentService.deleteUserPayment(e.row.data.id).subscribe(
          res => {
            this.toastrService.success("Eğitim Bilgisi Silindi", "İşlem Başarılı");
            this._dataSource();
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
      this._dataSource();
    }
  };
}

