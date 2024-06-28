import { formatDate } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import CustomStore from 'devextreme/data/custom_store';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { GridUtil } from 'src/app/_metronic/kt/_utils/GridUtil';
import { LeaveTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/leave-type-enum.model';
import { SalaryTypeLabelMapping } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { AmountTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/amount-type-enum.model';
import { PaymentCategoryTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/payment-category-type-enum.model';
import { TaxTypeEnum, TaxTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/tax-type-enum.model';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-spending-information',
  templateUrl: './spending-information.component.html',
  styleUrls: ['./spending-information.component.scss']
})
export class SpendingInformationComponent implements OnInit {
  @Output() newActiveTab = new EventEmitter<string>();
  @Input() userId: number;
  dataSource: CustomStore;
  paymentId: number;
  status:boolean;
  detailRow: any;
  clickedRowDescription: string;
  _startDate: Date = moment(new Date()).add(-30, 'day').toDate();
  _endDate: Date = new Date();
  filterOption: boolean=false;
  selectedValue: string = "false";

  constructor(
    private userPaymentService: UserPaymentService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal) {
  }

  AmountTypeEnumLabelMapping = AmountTypeEnumLabelMapping;
  PaymentCategoryTypeEnumLabelMapping = PaymentCategoryTypeEnumLabelMapping;
  SalaryTypeLabelMapping = SalaryTypeLabelMapping;
  TaxTypeLabelMapping=TaxTypeEnumLabelMapping;

  //#region leaveType
  LeaveTypeEnumLabelMapping = LeaveTypeEnumLabelMapping;
  //#endregion

  ngOnInit() {
    this.filterSpending(this.filterOption);
    this._dataSource(this.filterOption,this._startDate, this._endDate);
  }
  filterSpending(option: boolean | null) {
    this.filterOption = option;
    this._dataSource(option,this._startDate, this._endDate);
    this.cdr.detectChanges();
  }

  _dataSource(status,startDate, endDate) {
    this.dataSource = new CustomStore({
      key: 'id',
      load: () => GridUtil.handleGridResponse(this.userPaymentService.getSpendingInformation(status,startDate, endDate)),
    });
    this.cdr.detectChanges();
  }
  showLeaveDetailClick(e, userLeaveDetailModal) {
    this.paymentId = e.data.id;
    this.openModal(e, userLeaveDetailModal);
  }
  onRowClick(e) {
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
    this._dataSource(this.status,this._startDate, this._endDate);
  }
  dateForrmat(date) {
    const format = 'MM.dd.yyyy';
    const locale = 'en-US';

    return formatDate(date, format, locale);
  }
  reloadDataSource(e) {
    if (e == "true") {
      this.modalService.dismissAll();
      this._dataSource(this.status,this._startDate, this._endDate);
    }
  };
  editLeaveClick(e, userSpendingInformationEdit) {
    this.paymentId = e.data.id;
    this.modalService.open(userSpendingInformationEdit, { size: 'lg' });
  }
}
