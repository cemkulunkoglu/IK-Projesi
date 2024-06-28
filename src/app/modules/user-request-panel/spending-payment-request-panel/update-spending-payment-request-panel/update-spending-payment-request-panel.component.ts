import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { UserPaymentService } from 'src/app/core/services/users/user-payment.service';

@Component({
  selector: 'app-update-spending-payment-request-panel',
  templateUrl: './update-spending-payment-request-panel.component.html',
  styleUrls: ['./update-spending-payment-request-panel.component.scss']
})
export class UpdateSpendingPaymentRequestPanelComponent implements OnInit{
  @Output() userPaymentEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  paymentUpdateForm: FormGroup;


   @Input() paymentId: number;
   userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private paymentService:UserPaymentService,
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
