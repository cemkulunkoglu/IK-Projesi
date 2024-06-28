import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { SpecialDeductionService } from 'src/app/core/services/users/special-deduction.service';

@Component({
  selector: 'app-special-deduction-update',
  templateUrl: './special-deduction-update.component.html',
  styleUrls: ['./special-deduction-update.component.scss']
})
export class SpecialDeductionUpdateComponent implements OnInit {
  @Output() specialDeductionEdit = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  @Input() specialDeductionId: number;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  paymentUpdateForm: FormGroup;
  userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(private fb: FormBuilder,
    private specialDeductionService: SpecialDeductionService,
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
      includeInBardroy: [false],
      skipApprovalProcess: [false],
      sendEmployeeNotification: [false],
    });

    this.paymentUpdateForm.get('isPaid').valueChanges.subscribe(value => {
      if (!value) {
        this.paymentUpdateForm.patchValue({
          paidDate: null,
        });
      }
    });

    this.specialDeductionService.getSpecialDeductionById(this.specialDeductionId).subscribe(res => {
      this.paymentUpdateForm.patchValue({
        id: res.data.id,
        userId: res.data.userId,
        isPaid: res.data.isPaid,
        paidDate: res.data.paidDate,
        includeInBardroy: res.data.includeInBardroy,
        skipApprovalProcess: res.data.skipApprovalProcess,
        sendEmployeeNotification: res.data.sendEmployeeNotification,
      });
    });
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
      this.specialDeductionService.updateSpecialDeduction(this.paymentUpdateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.specialDeductionEdit.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.specialDeductionEdit.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.specialDeductionEdit.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
