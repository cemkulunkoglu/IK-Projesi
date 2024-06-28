import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { SalaryTypeLabelMapping, SalaryTypeEnum } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { AmountTypeEnum, AmountTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/amount-type-enum.model';
import { PaymentCategoryTypeEnum, PaymentCategoryTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/payment-category-type-enum.model';
import { TaxTypeEnum, TaxTypeEnumLabelMapping } from 'src/app/core/enums/user/spending/tax-type-enum.model';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-sidebar-spending-payment',
  templateUrl: './sidebar-spending-payment.component.html',
  styleUrls: ['./sidebar-spending-payment.component.scss']
})
export class SidebarSpendingPaymentComponent implements OnInit {
  currentUser: UserType;
  userId: number;

  @Output() userPaymentCreate = new EventEmitter<string>();

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  paymentCreateForm: FormGroup;
  uploadedFile: File | null = null;

  getCurrentUser() {
    this.currentUser = this.authService.currentUserValue;
  }

  //#region enum
  salaryTypeLabelMapping = SalaryTypeLabelMapping;
  salaryTypeEnum = Object.values(SalaryTypeEnum).filter(value => typeof value === 'number');

  amountTypeLabelMapping = AmountTypeEnumLabelMapping;
  amountTypeEnum = Object.values(AmountTypeEnum).filter(value => typeof value === 'number');

  paymentCategoryTypeLabelMapping = PaymentCategoryTypeEnumLabelMapping;
  paymentCategoryTypeEnum = Object.values(PaymentCategoryTypeEnum).filter(value => typeof value === 'number');

  taxTypeLabelMapping = TaxTypeEnumLabelMapping;
  taxTypeEnum = Object.values(TaxTypeEnum).filter(value => typeof value === 'number');
  //#endregion

  isPaid = false;
  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    public userPaymentService: UserPaymentService,
    private toastrService: ToastrService,
    private authService: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.getCurrentUser();
    this.userId = this.activatedRoute.snapshot.params.id !== '0' ? +this.activatedRoute.snapshot.params.id : this.currentUser.id;

    this.paymentCreateForm = this.fb.group({
      userId: [this.userId],
      description: ["", Validators.required],
      paymentDate: [""],
      paidDate: [""],
      paymentType: [4],
      amountType: ["", Validators.required],
      amountMoneyType: [AmountTypeEnum.TL],
      paymentCategory: ["", Validators.required],
      taxType: [TaxTypeEnum.PercentageTwenty],
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
  };

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (this.paymentCreateForm) {
      const extension = this.extractFileExtension(file);
      if (extension.toLowerCase() !== 'pdf') {
        this.toastrService.error('Sadece PDF dosya formatına izin verilmektedir.', 'Hata');
        return;
      }

      this.uploadedFile = file;
      this.paymentCreateForm.patchValue({
        extension: extension
      });

      this.convertFileToBase64(file);
    }
  }

  convertFileToBase64(file: File): void {
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64Content = reader.result as string;
      const startIndex = base64Content.indexOf(',') + 1;
      const cleanedBase64 = base64Content.substring(startIndex);
      this.paymentCreateForm.patchValue({
        content: cleanedBase64
      });
    };

    reader.readAsDataURL(file);
  }

  extractFileExtension(file: File): string {
    const fileName = file.name;
    const lastDotIndex = fileName.lastIndexOf('.');
    return fileName.substring(lastDotIndex + 1);
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
