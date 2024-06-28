import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable, BehaviorSubject, Subscription, Subject } from 'rxjs';
import { UserOvertimeService } from 'src/app/core/services/users/user-overtime.service';

@Component({
  selector: 'app-overtime-create',
  templateUrl: './overtime-create.component.html',
  styleUrls: ['./overtime-create.component.scss']
})
export class OvertimeCreateComponent implements OnInit {
  @Output() userOvertimeCreate = new EventEmitter<string>();
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  private unsubscribe: Subscription[] = [];
  overtimeCreateForm: FormGroup;

  @Input() userId: number;

  _onDestroy = new Subject<void>();
  message: string;

  constructor(
    private fb: FormBuilder,
    private userOvertimeService: UserOvertimeService,
    private toastrService: ToastrService
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit() {
    this.overtimeCreateForm = this.fb.group({
      userId: [this.userId, Validators.required],
      description: ["", Validators.required],
      timeHour: ["", Validators.required],
      timeMinute: ["", Validators.required],
      startDate: ["", Validators.required],
      skipApprovalProcess: [false],
      sendInformationalEmailToEmployee: [false]
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

  saveOvertime() {
    this.isLoadingSubject.next(true);
    this.message = "";
    if (this.overtimeCreateForm.valid) {
      this.overtimeCreateForm.value.startDate = this.adjustForTimezone(new Date(this.overtimeCreateForm.value.startDate));
      this.userOvertimeService.createUserOvertime(this.overtimeCreateForm.value).subscribe(
        res => {
          if (res.data == 0) {
            this.toastrService.warning(res.messages[0].toString());
            this.isLoadingSubject.next(false);
            this.userOvertimeCreate.emit("true");
          } else {
            this.toastrService.success("İşlem Başarılı");
            this.isLoadingSubject.next(false);
            this.userOvertimeCreate.emit("true");
          }
        },
        err => {
          err.error.messages.forEach(element => {
            this.message += element + '. ';
          });
          this.toastrService.error(this.message, "Hata");
          this.isLoadingSubject.next(false);
          this.userOvertimeCreate.emit("true");
        }
      );
    } else {
      this.toastrService.warning("Formu Kontrol Ediniz.", "Uyarı");
      this.isLoadingSubject.next(false);
    }
  }
}
