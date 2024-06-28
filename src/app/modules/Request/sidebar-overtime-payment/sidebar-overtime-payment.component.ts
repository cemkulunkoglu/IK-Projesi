import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subscription, Subject } from 'rxjs';
import { SalaryTypeLabelMapping, SalaryTypeEnum } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-sidebar-overtime-payment',
  templateUrl: './sidebar-overtime-payment.component.html',
  styleUrls: ['./sidebar-overtime-payment.component.scss']
})
export class SidebarOvertimePaymentComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    public userPaymentService: UserPaymentService,
    private toastrService: ToastrService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.userId = this.activatedRoute.snapshot.params.id !== '0' ? +this.activatedRoute.snapshot.params.id : this.currentUser.id;

    this.paymentCreateForm = this.fb.group({
      userId: [this.userId],
      description: [""],
      paymentDate: ["", Validators.required],
      paidDate: [""],
      paymentType: [6],
      amountType: ["", Validators.required],
      amount: [0, Validators.required],
      instalment: [0],
      isPaid: [false],
      sendInformationalEmailToEmployee: [false],
      includeInPayroll: [false],
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
    const timeOffsetInMS: number = date.getTimezoneOffset() * 60000;
    date.setTime(date.getTime() - timeOffsetInMS);
    return date;
  };

  savePayment() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.paymentCreateForm.valid) {
      const formValue = { ...this.paymentCreateForm.value };
      formValue.paidDate = this.adjustForTimezone(new Date(formValue.paidDate));
      formValue.paymentDate = this.adjustForTimezone(new Date(formValue.paymentDate));

      this.userPaymentService.createUserPayment(formValue).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
          } else {
            this.toastrService.success("İşlem Başarılı");
            setTimeout(() => window.location.reload(), 1000);
          }
          this.isLoadingSubject.next(false);
          this.userPaymentCreate.emit("true");
        },
        err => {
          this.message = err.error.messages.join('. ');
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
