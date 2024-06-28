import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { SalaryTypeLabelMapping, SalaryTypeEnum } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { AdditionalTypeEnum, AdditionalTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/additional-type-enum.model';
import { AmountTypeEnum, AmountTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/amount-type-enum.model';
import { PaymentAdditionalTypeEnum, PaymentAdditionalTypeLabelMapping } from 'src/app/core/enums/user/spending/payment-additional-type-enum.model';
import { RecurrentPayTypeEnum, RecurrentPayTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/recurrent-pay-type-enum.model';
import { AdditionalPaymentService } from 'src/app/core/services/users/additional-payment.service';

@Component({
  selector: 'app-additional-payment-create',
  templateUrl: './additional-payment-create.component.html',
  styleUrls: ['./additional-payment-create.component.scss']
})
export class AdditionalPaymentCreateComponent implements OnInit {
  @Input() userId: number;
  @Output() userPaymentCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  additionalPaymentCreateForm: FormGroup;

  paymentTypeEnumLabelMapping = PaymentAdditionalTypeLabelMapping;
  paymentTypeEnum = Object.values(PaymentAdditionalTypeEnum).filter(value => typeof value === 'number');

  salaryTypeLabelMapping = SalaryTypeLabelMapping;
  salaryTypeEnum = Object.values(SalaryTypeEnum).filter(value => typeof value === 'number');

  recurrentPayTypeEnumLabelMapping = RecurrentPayTypeEnumLabelMapping;
  recurrentPayTypeEnum = Object.values(RecurrentPayTypeEnum).filter(value => typeof value === 'number');

  amountTypeEnumLabelMapping = AmountTypeEnumLabelMapping;
  amountTypeEnum = Object.values(AmountTypeEnum).filter(value => typeof value === 'number');

  additionalTypeEnumLabelMapping = AdditionalTypeEnumLabelMapping;
  additionalTypeEnumList = Object.values(AdditionalTypeEnum).filter(value => typeof value === 'number');

  isPaid = false;
  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    public userAdditionalPaymentService: AdditionalPaymentService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    this.additionalPaymentCreateForm = this.fb.group({
      userId: [this.userId],
      paymentType: ["", Validators.required],
      paymentMethod: [""],
      validityDate: [""],
      recurrentPay: ["", Validators.required],
      additionalTypeEnum: ["", Validators.required],
      amountType: ["", Validators.required],
      amount: [0],
      description: [""],
      isPaid: [false],
      includeInPayroll: [false],
      paidDate: [""]
    });

    this.additionalPaymentCreateForm.get('isPaid').valueChanges.subscribe(value => {
      if (!value) {
        this.additionalPaymentCreateForm.patchValue({
          isPaid: false,
          paidDate: null
        });
        this.additionalPaymentCreateForm.get('paidDate').disable();
      } else {
        this.additionalPaymentCreateForm.get('paidDate').enable();
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  adjustForTimezone(date: Date): Date {
    const timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  }

  savePayment() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.additionalPaymentCreateForm.valid) {
      if (this.additionalPaymentCreateForm.value.paidDate) {
        this.additionalPaymentCreateForm.value.paidDate = this.adjustForTimezone(new Date(this.additionalPaymentCreateForm.value.paidDate));
      }
      if (this.additionalPaymentCreateForm.value.validityDate) {
        this.additionalPaymentCreateForm.value.validityDate = this.adjustForTimezone(new Date(this.additionalPaymentCreateForm.value.validityDate));
      }
      this.userAdditionalPaymentService.createAdditionalPayment(this.additionalPaymentCreateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userPaymentCreate.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userPaymentCreate.emit("true");
            setTimeout(() => window.location.reload(), 1000);
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userPaymentCreate.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
