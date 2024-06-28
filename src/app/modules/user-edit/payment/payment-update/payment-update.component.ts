import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { PaymentTypeEnumLabelMapping, PaymentTypeEnum } from 'src/app/core/enums/user/payment-type/payment-type-enum.model';
import { SalaryTypeLabelMapping, SalaryTypeEnum } from 'src/app/core/enums/user/salary/salary-type-enum.model.enum';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-payment-update',
  templateUrl: './payment-update.component.html',
  styleUrls: ['./payment-update.component.scss']
})
export class PaymentUpdateComponent implements OnInit {
  @Output() userPaymentEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  paymentUpdateForm: FormGroup;
  uploadedFile: File | null = null;

  @Input() paymentId: number;
  userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private paymentService: UserPaymentService,
    private toastrService: ToastrService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.paymentUpdateForm = this.fb.group({
      id: ["", Validators.required],
      userId: [this.userId, Validators.required],
      isPaid: [false],
      paidDate: [null],
      extension: [""],
      content: [null],
    });
    this.paymentUpdateForm.get('isPaid').valueChanges.subscribe(value => {
      if (!value) {
        this.paymentUpdateForm.patchValue({
          paidDate: null,
        });
      }
    });
    this.paymentUpdateForm.get('isPaid').valueChanges.subscribe(value => {
      if (!value) {
        this.paymentUpdateForm.patchValue({
          isPaid: false
        });
      }
    });

    this.paymentService.getUserPaymentById(this.paymentId).subscribe(res => {
      this.paymentUpdateForm.controls["id"].setValue(res.data.id);
      this.paymentUpdateForm.controls["userId"].setValue(res.data.userId);
      this.paymentUpdateForm.controls["isPaid"].setValue(res.data.isPaid);
      this.paymentUpdateForm.controls["paidDate"].setValue(res.data.paidDate);
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (this.paymentUpdateForm) {
      const extension = this.extractFileExtension(file);
      if (extension.toLowerCase() !== 'pdf') {
        this.toastrService.error('Sadece PDF dosya formatına izin verilmektedir.', 'Hata');
        return;
      }

      this.uploadedFile = file;
      this.paymentUpdateForm.patchValue({
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

      this.paymentUpdateForm.patchValue({
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
    if (this.paymentUpdateForm.valid) {
      this.paymentService.updateUserPayment(this.paymentUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userPaymentEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userPaymentEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userPaymentEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
