import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { StatusTypeEnum, StatusTypeEnumLabelMapping } from 'src/app/core/enums/user/leave/status-type-enum.model';
import { SalaryTypeLabelMapping, SalaryTypeEnum } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { SpecialDeductionTypeEnum, SpecialDeductionTypeLabelMapping } from 'src/app/core/enums/user/special-deduction/special-deduction-type-enum.model';
import { AdditionalTypeEnumLabelMapping, AdditionalTypeEnum } from 'src/app/core/enums/user/spending/additional-type-enum.model';
import { AmountTypeEnumLabelMapping, AmountTypeEnum } from 'src/app/core/enums/user/spending/amount-type-enum.model';
import { PaymentAdditionalTypeLabelMapping, PaymentAdditionalTypeEnum } from 'src/app/core/enums/user/spending/payment-additional-type-enum.model';
import { RecurrentPayTypeEnumLabelMapping, RecurrentPayTypeEnum } from 'src/app/core/enums/user/spending/recurrent-pay-type-enum.model';
import { AdditionalPaymentService } from 'src/app/core/services/users/additional-payment.service';
import { SpecialDeductionService } from 'src/app/core/services/users/special-deduction.service';

@Component({
  selector: 'app-special-deduction-create',
  templateUrl: './special-deduction-create.component.html',
  styleUrls: ['./special-deduction-create.component.scss']
})
export class SpecialDeductionCreateComponent implements OnInit {
  @Input() userId: number;
  @Output() specialDeductionCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  additionalPaymentCreateForm: FormGroup;

  SpecialDeductionTypeLabelMapping = SpecialDeductionTypeLabelMapping;
  specialDeductionTypeEnum = Object.values(SpecialDeductionTypeEnum).filter(value => typeof value === 'number');

  AmountTypeEnumLabelMapping = AmountTypeEnumLabelMapping;
  amountTypeEnum = Object.values(AmountTypeEnum).filter(value => typeof value === 'number');

  StatusTypeEnumLabelMapping = StatusTypeEnumLabelMapping;
  statusTypeEnum = Object.values(StatusTypeEnum).filter(value => typeof value === 'number');

  isPaid = false;
  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    public specialDeductionService: SpecialDeductionService,
    private toastrService: ToastrService,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.userId = this.activatedRoute.snapshot.params.id;
    this.additionalPaymentCreateForm = this.fb.group({
      userId: [this.userId,],
      paymentType: ["", Validators.required],
      amount: [0],
      amountType: ["", Validators.required],
      installment: ["", Validators.required],
      status: ["", Validators.required],
      startDate: [""],
      endDate: [""],
      description: [""],
      isPaid: [false],
      paidDate: [""],
      includeInBardroy: [false],
      skipApprovalProcess: [false],
      sendEmployeeNotification: [false]
    });

    this.additionalPaymentCreateForm.get('isPaid').valueChanges.subscribe(value => {
      if (!value) {
        this.additionalPaymentCreateForm.patchValue({
          isPaid: false
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  adjustForTimezone(date: Date): Date {
    var timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  };

  savePayment() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.additionalPaymentCreateForm.valid) {
      this.additionalPaymentCreateForm.value.paidDate = this.adjustForTimezone(new Date(this.additionalPaymentCreateForm.value.paidDate));
      this.additionalPaymentCreateForm.value.startDate = this.adjustForTimezone(new Date(this.additionalPaymentCreateForm.value.startDate));
      this.additionalPaymentCreateForm.value.endDate = this.adjustForTimezone(new Date(this.additionalPaymentCreateForm.value.endDate));

      this.specialDeductionService.createSpecialDeduction(this.additionalPaymentCreateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.specialDeductionCreate.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.specialDeductionCreate.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.specialDeductionCreate.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }

}
