import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { PaymentTypeEnum, PaymentTypeEnumLabelMapping } from 'src/app/core/enums/user/payment-type/payment-type-enum.model';
import { SalaryTypeLabelMapping, SalaryTypeEnum } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-sidebar-advance-payment',
  templateUrl: './sidebar-advance-payment.component.html',
  styleUrls: ['./sidebar-advance-payment.component.scss']
})
export class SidebarAdvancePaymentComponent implements OnInit {
  currentUser: UserType;
  @Input() userId: number;
  @Output() userPaymentCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  paymentCreateForm: FormGroup;

  getCurrentUser() {
    this.currentUser = this.authService.currentUserValue;
  }

  //#region Period
  salaryTypeLabelMapping = SalaryTypeLabelMapping;
  salaryTypeEnum = Object.values(SalaryTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  isPaid = false;
  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    public userPaymentService: UserPaymentService,
    private toastrService: ToastrService,
    private authService: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.getCurrentUser();

    this.paymentCreateForm = this.fb.group({
      userId: [this.currentUser.id,],
      description: [""],
      paymentDate: [""],
      paidDate: [""],
      paymentType: [2],
      amountType: ["", Validators.required],
      amount: [0],
      instalment: [0],
      isPaid: [false],
      extension: [""],
      content: [null],
    });

    this.paymentCreateForm.get('isPaid').valueChanges.subscribe(value => {
      if (!value) {
        this.paymentCreateForm.patchValue({
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
  }

  savePayment() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.paymentCreateForm.valid) {
      this.paymentCreateForm.value.paidDate = this.adjustForTimezone(new Date(this.paymentCreateForm.value.paidDate));
      this.paymentCreateForm.value.paymentDate = this.adjustForTimezone(new Date(this.paymentCreateForm.value.paymentDate));
      this.userPaymentService.createUserPayment(this.paymentCreateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userPaymentCreate.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userPaymentCreate.emit("true");
            setTimeout(() => {
              document.location.reload();
            }, 3000);
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

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
}

interface UserType {
  id: number;
}
